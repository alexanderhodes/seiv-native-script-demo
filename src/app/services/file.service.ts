import {Injectable} from "@angular/core";
import {CryptoService} from "~/app/services/crypto.service";
import {File} from "tns-core-modules/file-system";
import {ENCODING} from "~/app/config/config";

@Injectable({ providedIn: "root" })
export class FileService {

    readWithKey(key: native.Array<number>, path: string): string {
        const file = File.fromPath(path);
        const buffer = file.readSync(error => console.log('error', error));
        const decodedData = CryptoService.decodeFile(key, buffer);
        const data = new java.lang.String(decodedData, java.nio.charset.Charset.forName(ENCODING));
        return data ? data.toString() : null;
    }

    saveWithKey(key: native.Array<number>, text: string, path: string): void {
        const bytes = new java.lang.String(text).getBytes(java.nio.charset.Charset.forName(ENCODING));
        const file = new java.io.File(path);
        const bufferedOutputStream = new java.io.BufferedOutputStream(new java.io.FileOutputStream(file));
        const fileBytes = CryptoService.encodeFile(key, bytes);
        bufferedOutputStream.write(fileBytes);
        bufferedOutputStream.flush();
        bufferedOutputStream.close();
    }

}
