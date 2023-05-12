import crypto from 'crypto'
export class CryptController {
    algorithm = 'aes-256-ctr'
    secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3'

    encrypt = (text: any) => {
        const iv = crypto.randomBytes(16)

        const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, iv)

        const encrypted = Buffer.concat([cipher.update(text), cipher.final()])

        return {
            iv: iv.toString('hex'),
            content: encrypted.toString('hex')
        }
    }

    decrypt = (hash: any) => {
        const decipher = crypto.createDecipheriv(
            this.algorithm,
            this.secretKey,
            Buffer.from(hash.iv, 'hex')
        )

        const decrpyted = Buffer.concat([
            decipher.update(Buffer.from(hash.content, 'hex')),
            decipher.final()
        ])

        return decrpyted.toString()
    }
}
