import {Injectable} from "@angular/core";
import * as email from "nativescript-email";
import {Attachment} from "nativescript-email";
import {ToastService} from "~/app/services/toast.service";

@Injectable({ providedIn: "root" })
export class MailService {

    constructor(private toastService: ToastService) {    }

    /**
     * send mail to recipient with attachments
     * @param mailRecipient
     * @param attachments
     */
    sendMail(mailRecipient: string, attachments: Attachment[]): void {
        // check if email function is available before sending it
        email.available().then(available => {
            if (available) {
                this._sendMail(mailRecipient, attachments);
            }
        });
    }

    /**
     * send mail to recipient with attachments
     * @param mailRecipient
     * @param attachments
     */
    _sendMail(mailRecipient: string, attachments: Attachment[]): void {
        // create email with subject, body, recipient and add attachments
        // mail client installed on smartphone will be opened
        email.compose({
            subject: 'Demo attachment for security',
            body: 'See attached files',
            to: [mailRecipient],
            attachments: attachments
        }).then(() => {
            console.log('sending mail worked');
            // show toast message that everything worked
            this.toastService.show('Mail sent successfully');
        }, (error) => {
            console.log('sending mail failed', error);
        })
    }

}
