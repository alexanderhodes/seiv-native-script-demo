import {Injectable} from "@angular/core";
import {SecureStorage} from "nativescript-secure-storage";
import {ToastService} from "~/app/services/toast.service";

export const SECURE_STORAGE_KEY_NAME = 'name';

@Injectable({ providedIn: "root" })
export class SecureStorageService {

    private secureStorage: SecureStorage;

    constructor(private toastService: ToastService) {
        this.secureStorage = new SecureStorage();
    }

    getValue(key: string): any {
        return this.secureStorage.getSync({ key: key });
    }

    setValue(key: string, value: string): void {
        this.secureStorage.set({ key: key, value: value })
            .then(() => {
                this.toastService.show(`value ${value} successfully saved`);
            });
    }


}
