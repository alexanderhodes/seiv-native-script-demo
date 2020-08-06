import {Component, OnInit} from "@angular/core";
import {DatabaseService, SECURE_STORAGE_KEY_NAME, SecureStorageService, ToastService} from "~/app/services";

@Component({
    selector: "ns-menu",
    templateUrl: "./menu.component.html"
})
export class MenuComponent implements OnInit {

    name: string;
    title: string = 'Menu';
    target: string = '';

    constructor(private secureStorageService: SecureStorageService,
                private toastService: ToastService,
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
}
