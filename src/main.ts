import * as IMAP from "./IMAP";
import * as SMTP from "./SMTP";
import * as Contacts from "./contacts";
import {IContact} from "./contacts";
import {serverInfo} from "./ServerInfo";

import path from "path";
import express,
{Express, NextFunction, Request, Response} from "express";

const port = 3000
const app: Express = express();
app.use(express.json());
app.use("/",
    express.static(path.join(__dirname, "../../client/dist"))
);
app.use(function (inRequest: Request, inResponse: Response,
                  inNext: NextFunction) {
    inResponse.header("Access-Control-Allow-Origin", "*");
    inResponse.header("Access-Control-Allow-Methods",
        "GET,POST,DELETE,OPTIONS"
    );
    inResponse.header("Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept"
    );
    inNext();
});


app.get("/mailboxes", async (inRequest: Request, inResponse: Response) => {
    try {
        const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
        const mailboxes: IMAP.IMailbox[] = await imapWorker.listMailboxes()
        inResponse.status(200);
        inResponse.json(mailboxes);
    } catch (e) {
        inResponse.status(400);
        inResponse.send("error");
    }
})


app.get("/mailboxes/:mailbox", async (inRequest: Request, inResponse: Response) => {
    try {
        const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
        const messages: IMAP.IMessage[] = await imapWorker.listMessages({
            mailbox: inRequest.params.mailbox
        });
        inResponse.status(200)
        inResponse.json(messages);
    } catch (e) {
        inResponse.status(400)
        inResponse.send("error");
    }
})


app.get("/messages/:mailbox/:id", async (inRequest: Request, inResponse: Response) => {
    try {
        const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
        const messageBody: string|undefined = await imapWorker.getMessageBody({
            mailbox: inRequest.params.mailbox,
            id: parseInt(inRequest.params.id, 10)
        })
        inResponse.status(200)
        inResponse.send(messageBody)
    } catch (e) {
        inResponse.status(400)
        inResponse.send("error");
    }
})


app.delete("/messages/:mailbox/:id", async (inRequest: Request, inRepsonse: Response) => {
    try {
        const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
        await imapWorker.deleteMessage({
            mailbox: inRequest.params.mailbox,
            id: parseInt(inRequest.params.id),
        })
        inRepsonse.status(200)
        inRepsonse.send("ok")
    } catch (e) {
        inRepsonse.status(400);
        inRepsonse.send('error')
    }
})


app.post("/messages", async (inRequest: Request, inRepsonse: Response) => {
    try {
        const smtpWorker: SMTP.Worker = new SMTP.Worker(serverInfo);
        smtpWorker.sendMessage(inRequest.body);
        inRepsonse.status(200);
        inRepsonse.send("ok")
    } catch (e) {
        inRepsonse.status(400)
        inRepsonse.send("error")
    }
})


app.get("/contacts", async (inRequest: Request, inResponse: Response) => {
    try {
        const contactsWorker: Contacts.Worker = new Contacts.Worker()
        const contacts: IContact = contactsWorker.listContacts();
        inResponse.status(200)
        inResponse.json(contacts);
    } catch (e) {
        inResponse.status(400)
        inResponse.send('error')
    }
})

app.post("/contacts", async (inRequest: Request, inResponse: Response) => {
    try {
        const contactsWorker: Contacts.Worker = new Contacts.Worker()
        const contact: IContact = contactsWorker.addContact(inRequest.body)
        inResponse.status(200)
        inResponse.json(contact)
    } catch (e) {
        inResponse.status(400);
        inResponse.send("error")
    }
})

app.delete("/contatcts/:id", async (inRequest: Request, inResponse: Response) => {
    try {
        const contactsWorker: Contacts.Worker = new Contacts.Worker()
        await contactsWorker.deleteContact(inRequest.params);
        inResponse.status(200)
        inResponse.send ("ok");
    } catch (e) {
        inResponse.status(400)
        inResponse.send("error")
    }
})


app.listen(port, () => {
    console.log(`Mailbox backend listining at http://localhost:${port}`)
})
