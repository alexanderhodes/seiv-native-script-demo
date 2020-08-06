import {Injectable} from "@angular/core";
import {ToastDuration, ToastPosition, Toasty} from "nativescript-toasty";

@Injectable()
export class ToastService {

    show(text: string): void {
        new Toasty({ text: text })
            .setToastDuration(ToastDuration.LONG)
            .setToastPosition(ToastPosition.CENTER)
            .setTextColor('#fff')
            .setBackgroundColor('#000')
            .show();
    }

}
