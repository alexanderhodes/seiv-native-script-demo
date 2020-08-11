import {Injectable} from "@angular/core";
import {CryptoService} from "~/app/services/crypto.service";
import {ENCODING, KEY_FILE} from "~/app/config/config";
import {File, knownFolders} from "tns-core-modules/file-system";
import {Observable, ReplaySubject} from "rxjs";

@Injectable({ providedIn: "root" })
export class FileService {

    /**
     * read file with key and decode it
     * @param key
     * @param path
     */
    readWithKey(key: native.Array<number>, path: string): string {
        const file = File.fromPath(path);
        // read the content of the file
        const buffer = file.readSync(error => console.log('error', error));
        // decode data that is read from file
        const decodedData = CryptoService.decodeFile(key, buffer);
        // read decoded data and add encoding
        const data = new java.lang.String(decodedData, java.nio.charset.Charset.forName(ENCODING));
        return data ? data.toString() : null;
    }

    /**
     * save text to file and encrypt it with key
     * @param key
     * @param text
     * @param path
     */
    saveWithKey(key: native.Array<number>, text: string, path: string): Observable<boolean> {
        const subject$ = new ReplaySubject<boolean>(1);
        // encode text with encoding
        const bytes = new java.lang.String(text).getBytes(java.nio.charset.Charset.forName(ENCODING));
        // create file
        const file = new java.io.File(path);
        // create java output stream
        const bufferedOutputStream = new java.io.BufferedOutputStream(new java.io.FileOutputStream(file));
        // encode text by key
        const fileBytes = CryptoService.encodeFile(key, bytes);
        // write encoded text to file
        bufferedOutputStream.write(fileBytes);
        bufferedOutputStream.flush();
        bufferedOutputStream.close();

        subject$.next(true);
        subject$.complete();

        return subject$.asObservable();
    }

    /**
     * just read a file from path and return the content of this file
     * @param path
     */
    read(path: string): Promise<string> {
        const file = knownFolders.currentApp().getFile(path);
        return file.readText();
    }

    /**
     * write content passed into the file
     * @param path
     * @param content
     */
    write(path: string, content: any): Observable<boolean> {
        const subject$ = new ReplaySubject<boolean>(1);

        const file = File.fromPath(path);
        file.writeText(content).then(() => {
            console.log('success writing file');
            subject$.next(true);
            subject$.complete();
        }, (error) => {
            console.log('error writing file', error);
            subject$.next(false);
            subject$.complete();
        });

        return subject$.asObservable();
    }

    /**
     * get complete path for file name passed
     * @param fileName
     */
    getFilePath(fileName: string): string {
        return knownFolders.currentApp().getFile(fileName).path;
    }

    saveKey(key: native.Array<number>): void {
        let keyText = '';
        for (let i = 0; i < key.length; i++) {
            keyText += key[i];
        }
        this.write(KEY_FILE, keyText);
    }
}
