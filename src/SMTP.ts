import Mail from "nodemailer/lib/mailer";
import * as nodemailer from "nodemailer";
import {SendMailOptions, SentMessageInfo} from "nodemailer";
import {IServerInfo} from "./ServerInfo"

export class Worker {
    private static serverInfo: IServerInfo;

    constructor(inServerInfo: IServerInfo) {
        Worker.serverInfo = inServerInfo;
    }

    public sendMesasge(inOption: SendMailOptions): Promise<String> {
        return new Promise<String>((inResolve, inReject) => {
            const transport: Mail = nodemailer.createTransport(Worker.serverInfo.smtp);
            transport.sendMail(inOption, (inError: Error | null, inInfo: SentMessageInfo) => {
                if (inError) {
                    inReject(inError);
                } else {
                    inResolve();
                }
            })
        })
    }
}
