import dotenv from 'dotenv'

dotenv.config()

interface Config {
    PORT: string
    MongoPort: number
    MongoDatabase: string
    JwtSecret: string
    NodeEnv: string
    MongoPassword: string
    Lifetime: string
    SmsToken: string
    SENDGRID_API: string
}

let config: Config = {
    PORT: getConf('PORT', '3044'),
    MongoPort: parseInt(getConf('MONGO_PORT', '27017')),
    MongoDatabase: getConf('MONGO_DATABASE', 'humanifyv1'),
    JwtSecret: getConf('JWT_SECRET', 'qwertysecret'),
    NodeEnv: getConf('NODE_ENV', 'development'),
    MongoPassword: getConf('MONGO_PASSWORD', '200013fev.'),
    Lifetime: getConf('LIFETIME', '30d'),
    SmsToken: getConf('SMSTOKEN', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjk3OSwicm9sZSI6InVzZXIiLCJkYXRhIjp7ImlkIjo5NzksIm5hbWUiOiJcdTA0MWVcdTA0MWVcdTA0MWUgSGFuZHktQXBwIiwiZW1haWwiOiJha2htZWQwMzAxQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiYXBpX3Rva2VuIjoiZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6STFOaUo5LmV5SnpkV0lpT2prM09Td2ljbTlzWlNJNkluVnpaWElpTENKa1lYUmhJanA3SW1sa0lqbzVOemtzSW01aGJXVWlPaUpjZFRBME1XVmNkVEEwTVdWY2RUQTBNV1VnU0dGdVpIa3RRWEJ3SWl3aVpXMWhhV3dpT2lKaGEyaHRaV1F3TXpBeFFHZHRZV2xzTG1OdmJTSXNJbkp2YkdVaU9pSjFjMlZ5SWl3aVlYQnBYM1J2YTJWdUlqcHVkV3hzTENKemRHRjBkWE1pT2lKaFkzUnBkbVVpTENKemJYIiwic3RhdHVzIjoiYWN0aXZlIiwic21zX2FwaV9sb2dpbiI6ImVza2l6MiIsInNtc19hcGlfcGFzc3dvcmQiOiJlJCRrIXoiLCJ1el9wcmljZSI6NTAsInVjZWxsX3ByaWNlIjo1MCwiYmFsYW5jZSI6MzAwMDAwLCJpc192aXAiOjAsImhvc3QiOiJzZXJ2ZXIxIiwiY3JlYXRlZF9hdCI6IjIwMjItMDgtMTJUMDc6MTY6MjAuMDAwMDAwWiIsInVwZGF0ZWRfYXQiOiIyMDIyLTA4LTEyVDA5OjA3OjQyLjAwMDAwMFoifSwiaWF0IjoxNjYwMjk1OTgzLCJleHAiOjE2NjI4ODc5ODN9.KCXAT-nNX5iKAbzdPn4sQnhrOC_tksMe3xPOSNej478'),
    SENDGRID_API: getConf('SENDGRID_API', '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')
}

function getConf(name: string, def: string = ''): string {
    if (process.env[name]) {
        return process.env[name] || ''
    }

    return def
}

export default config
