
export class CryptoService {

    public static generateKey(password: java.lang.String): native.Array<number> {
        const keyStart = password.getBytes("UTF-8");
        const keyGenerator = javax.crypto.KeyGenerator.getInstance("AES");
        const secureRandom = java.security.SecureRandom.getInstance("SHA1PRNG");
        secureRandom.setSeed(keyStart);
        keyGenerator.init(128, secureRandom);
        const secretKey = keyGenerator.generateKey();
        return secretKey.getEncoded();
    }

    public static encodeFile(key: native.Array<number>, fileData: native.Array<number>) {
        const secretKeySpec = new javax.crypto.spec.SecretKeySpec(key, "AES");
        const cipher = javax.crypto.Cipher.getInstance("AES");
        cipher.init(javax.crypto.Cipher.ENCRYPT_MODE, secretKeySpec);
        return cipher.doFinal(fileData);
    }

    public static decodeFile(key: native.Array<number>, fileData: native.Array<number>) {
        const secretKeySpec = new javax.crypto.spec.SecretKeySpec(key, "AES");
        const cipher = javax.crypto.Cipher.getInstance("AES");
        cipher.init(javax.crypto.Cipher.DECRYPT_MODE, secretKeySpec);
        return cipher.doFinal(fileData);
    }

}
