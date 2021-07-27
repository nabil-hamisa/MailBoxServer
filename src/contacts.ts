import * as path from "path"
import ts from "typescript/lib/tsserverlibrary";
import createInstallTypingsRequest = ts.server.createInstallTypingsRequest;

const Datastore = require("nedb")


export interface IContact {
    _id?: number,
    name: string,
    email: string
}

export class Worker {
    private db: any;


    constructor() {
        this.db = new Datastore({
            filename: path.join(__dirname, "contacts.db"),
            autoload: true
        })
    }


    public listContacts(): Promise<IContact[]> {
        return new Promise((inResolve, inReject) => {
            this.db.find({}, (inError: Error, inDocs: IContact[]) => {
                if (inError) {
                    inReject(inError)
                } else {
                    inResolve(inDocs)
                }
            })
        })
    }

    public addContact(inContacts: IContact): Promise<IContact> {
        return new Promise((inResolve, inReject) => {
            this.db.insert(inContacts, (inError: Error, inNewDoc: IContact) => {
                if (inError) {
                    inReject(inError);
                } else {
                    inResolve(inNewDoc);
                }
            })
        })
    }

    public deleteContact(inId:string):Promise<string>{
        return new Promise((inResolve,inReject)=>{
            this.db.remove({_id:inId},{},(inError:Error,inNumRemoved:number)=>{
                if(inError){
                    inReject(inError);
                }else{
                    inResolve(inNumRemoved.toString());
                }
            })
        })
    }

}
