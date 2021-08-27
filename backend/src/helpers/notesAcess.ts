import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'
import { NoteItem } from '../models/NoteItem'
import { UpdateNoteRequest } from "../requests/UpdateNoteRequest";



const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('notesAccess');


export class NoteAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly noteTable = process.env.NOTES_TABLE,
        private readonly indexName = process.env.NOTES_INDEX
    ) { }

    //----------------------CREATE NOTE--------------------
    async createNote(item: NoteItem): Promise<NoteItem> {
        logger.info('Creating note:', item)
        await this.docClient.put({ TableName: this.noteTable, Item: item, }).promise();
        return item
    }

    //--------------------DELETE NOTE--------------------
    async deleteNote(noteId: string, userId: string): Promise<void> {
        logger.info('Deleting note', { noteId, userId })
        await this.docClient.delete({ TableName: this.noteTable, Key: { noteId, userId } }).promise()
    }

    //-----------------------GET NOTES---------------------
    async getNotes(userId: string): Promise<NoteItem[]> {
        logger.info('Getting notes for user:', userId)
        const result = await this.docClient.query({
            TableName: this.noteTable,
            IndexName: this.indexName,
            KeyConditionExpression: 'userId = :userId',
            ProjectionExpression: '#content, noteId, createdDate, createdAt, attachment, attachmentUrl',
            ExpressionAttributeNames: { "#content": "content" },
            ExpressionAttributeValues: { ':userId': userId }
        }).promise()
        const items = result.Items
        return items as NoteItem[]
    }

    //-------------------------UPDATE NOTE------------------------
    async updateNote(noteId: string, userId: string, updatedNote: UpdateNoteRequest) {
        logger.info('Update note', noteId)
        const updtedNote = await this.docClient.update({
            TableName: this.noteTable,
            Key: { noteId, userId },
            ExpressionAttributeNames: {
                "#content": "content"
            },
            UpdateExpression: "set #content = :content, createdDate = :createdDate, attachment = :attachment",
            ExpressionAttributeValues: {
                ":content": updatedNote.content,
                ":createdDate": updatedNote.createdDate,
                ":attachment": updatedNote.attachment
            },
            ReturnValues: "UPDATED_NEW"
        })
            .promise()
        return { Updated: updtedNote }
    }

    //-------------------------GET NOTE------------------------
    async getNote(noteId, userId) {
        const result = await this.docClient.get({
            TableName: this.noteTable,
            Key: {
                noteId,
                userId
            }
        }).promise();

        return result.Item;
    }

}