import {Component, OnInit} from "@angular/core";
import {
    DatabaseService,
    SECURE_STORAGE_KEY_NAME,
    SecureStorageService,
    ToastService,
    TodoService
} from "~/app/services";
import {CryptoService} from "~/app/services/crypto.service";
import {FileService} from "~/app/services/file.service";
import {MailService} from "~/app/services/mail.service";
import {Attachment} from "nativescript-email";
import {take} from "rxjs/internal/operators";
import {IToDo} from "~/app/interfaces";
import {ENCRYPTED_FILE, PASSWORD, UNENCRYPTED_FILE} from "~/app/config/config";
import {zip} from "rxjs";

@Component({
    selector: "ns-menu",
    templateUrl: "./menu.component.html"
})
export class MenuComponent implements OnInit {

    name: string;
    email: string;
    title: string = 'Menu';
    target: string = '';

    constructor(private secureStorageService: SecureStorageService,
                private toastService: ToastService,
                private fileService: FileService,
                private mailService: MailService,
                private todoService: TodoService,
                private databaseService: DatabaseService) {
        this.name = '';
    }

    ngOnInit(): void {
        this.name = this.secureStorageService.getValue(SECURE_STORAGE_KEY_NAME);
    }

    saveName(): void {
        this.secureStorageService.setValue(SECURE_STORAGE_KEY_NAME, this.name);
    }

    deleteToDos(): void {
        this.databaseService.deleteAllToDos().subscribe(success => {
            const text = success ? 'deleted all todos' : 'deletion failed';
            this.toastService.show(text);
        });
    }

    sendMail(): void {
        if (this.email) {
            this.todoService.getToDos$()
                .pipe(take(1))
                .subscribe((todos: IToDo[]) => {
                    console.log('todos', todos);
                    let text = '';

                    todos.forEach((todo: IToDo) => {
                        text += `${todo.id}: ${todo.name} - done: ${todo.done}\n`;
                    });

                    // create key and store it into file
                    const key = CryptoService.generateKey(new java.lang.String(PASSWORD));

                    // create files - encrypted and unencrypted
                    zip(
                        this.fileService.saveWithKey(key, text, this.fileService.getFilePath(ENCRYPTED_FILE)),
                        this.fileService.write(this.fileService.getFilePath(UNENCRYPTED_FILE), text)
                        // async call and wait till files are created
                    ).pipe().subscribe(([a, b]) => {
                        console.log('created files');
                        // create attachments
                        const attachments: Attachment[] = this._createAttachments();
                        // send mail
                        this.mailService.sendMail(this.email, attachments);

                    });
                });

        } else {
            // user has to
            this.toastService.show('Please enter your e-mail.');
        }
    }

    private _createAttachments(): Attachment[] {
        return [{
            fileName: ENCRYPTED_FILE,
            mimeType: 'text/plain',
            path: this.fileService.getFilePath(ENCRYPTED_FILE)
        }, {
            fileName: UNENCRYPTED_FILE,
            mimeType: 'text/plain',
            path: this.fileService.getFilePath(UNENCRYPTED_FILE)
        }] as Attachment[];
    }
}
