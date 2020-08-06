import {Component, OnInit} from "@angular/core";
import {IToDo} from "~/app/interfaces";
import {SECURE_STORAGE_KEY_NAME, SecureStorageService, TodoService} from "~/app/services";
import {FileService} from "~/app/services/file.service";
import { knownFolders, path, File, Folder } from "tns-core-modules/file-system";
import {CryptoService} from "~/app/services/crypto.service";

@Component({
    selector: "ns-main",
    templateUrl: "./main.component.html"
})
export class MainComponent implements OnInit {

    text: string;
    toDos: IToDo[];
    name: string;
    title: string = 'ToDo\'s';
    target: string = 'menu';

    constructor(private todoService: TodoService,
                private fileService: FileService,
                private secureStorageService: SecureStorageService) {
        this.toDos = [];
        this.name = '';
    }

    ngOnInit(): void {
        this.name = this.secureStorageService.getValue(SECURE_STORAGE_KEY_NAME);
        this.updateTodoList();
    }

    addTodo(): void {
        if (this.text && this.text.length) {
            let documents = knownFolders.documents();
            let folder = documents.getFolder('test');
            let file = folder.getFile('readme.txt');
            const key = CryptoService.generateKey(new java.lang.String('password'));

            console.log('file', file.path);

            this.fileService.saveWithKey(key, this.text, file.path);
            this.todoService.addTodo(this.text)
                .subscribe(success => {
                    if (success) {
                        this.updateTodoList();
                    }
                });
            this.text = '';
            const read = this.fileService.readWithKey(key, file.path);
            console.log('read', read);
        }
    }

    toggleDone(todo: IToDo): void {
        this.todoService.toggleDone(todo)
            .subscribe(success => {
                if (success) {
                    this.updateTodoList();
                }
            });
    }

    getTitle(): string {
        return `Hi ${ this.name ? this.name : '' }, here are your todo\'s for today!`;
    }

    private updateTodoList(): void {
        this.todoService.getToDos$()
            .subscribe((toDos: IToDo[]) => {
                this.toDos = toDos;
            });
    }

}
