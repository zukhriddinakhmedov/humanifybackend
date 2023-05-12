import express, { Request, Response } from 'express'
import cors from 'cors'
import http from 'http'
import routes from './routes/index'
import { expressLogger } from './config/logger'
import { ErrorController } from './controllers/error'
import { langMiddleware } from './middleware/lang'
import { Server } from 'socket.io'
import { CryptController } from './controllers/cript'
import { storage } from './storage/main'
import { IMessage } from './models/Message'
const app = express()
let server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})
const controller = new CryptController()

// middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(expressLogger())
app.use(langMiddleware)

app.use('/v1', routes)

io.on('connection', (socket) => {
    const id = socket.handshake.query.id
    if (typeof id === 'string') {
        socket.join(id)
    }

    socket.on('send-message', async ({ recipients, text, reply_id }) => {
        if (!id) return;
        const body = controller.encrypt(text)
        const decrypt = controller.decrypt(body)
        console.log('body: ', body)
        console.log('after body: ', decrypt)
        const new_message: any = {
            sender_id: id?.toString(),
            receiver_id: recipients[0],
            body: controller.encrypt(text),
            reply_to: reply_id
        }

        const message = await storage.message.create(new_message)

        recipients.forEach((recipient: string) => {
            const newRecipients = recipients.filter((r: string) => r !== recipient)
            newRecipients.push(id)
            socket.broadcast.to(recipient).emit('receive-message', message)
        })
    })
})

app.get('/status', (req: Request, res: Response) => {
    res.json({
        status: 'OK'
    })
})

const errorController = new ErrorController()
app.use(errorController.handle)

export default server
