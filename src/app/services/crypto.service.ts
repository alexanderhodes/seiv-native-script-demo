import {ENCODING, ENCRYPTION, HASH_FUNCTION} from "~/app/config/config";

export class CryptoService {

    public static generateKey(password: java.lang.String): native.Array<number> {
        const keyStart = password.getBytes(ENCODING);
        const keyGenerator = javax.crypto.KeyGenerator.getInstance(ENCRYPTION);
        const secureRandom = java.security.SecureRandom.getInstance(HASH_FUNCTION);
        secureRandom.setSeed(keyStart);
        keyGenerator.init(128, secureRandom);
        const secretKey = keyGenerator.generateKey();
        return secretKey.getEncoded();
    }

    public static encodeFile(key: native.Array<number>, fileData: native.Array<number>) {
        const secretKeySpec = new javax.crypto.spec.SecretKeySpec(key, ENCRYPTION);
        const cipher = javax.crypto.Cipher.getInstance(ENCRYPTION);
        cipher.init(javax.crypto.Cipher.ENCRYPT_MODE, secretKeySpec);
        return cipher.doFinal(fileData);
    }

    public static decodeFile(key: native.Array<number>, fileData: native.Array<number>) {
        const secretKeySpec = new javax.crypto.spec.SecretKeySpec(key, ENCRYPTION);
        const cipher = javax.crypto.Cipher.getInstance(ENCRYPTION);
        cipher.init(javax.crypto.Cipher.DECRYPT_MODE, secretKeySpec);
        return cipher.doFinal(fileData);
    }

}
