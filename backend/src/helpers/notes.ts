import 'source-map-support/register'
import * as uuid from 'uuid'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { NoteAccess } from './notesAcess'
import { NoteStorage } from './attachmentUtils'
import { getUserId } from '../lambda/utils'
import { CreateNoteRequest } from '../requests/CreateNoteRequest'
import { UpdateNoteRequest } from '../requests/UpdateNoteRequest'
import { NoteItem } from '../models/NoteItem'

const noteAccess = new NoteAccess()
const noteStorage = new NoteStorage()

//=========================================CREATE NOTE========================
export async function createNote(event: APIGatewayProxyEvent, CreateNoteRequest: CreateNoteRequest): Promise<NoteItem> {
    const noteId = uuid.v4()
    const userId = getUserId(event)
    const createdAt = new Date(Date.now()).toISOString()
    const attachment = false
    const noteItem = {
        userId,
        noteId,
        createdAt,
        attachment,
        attachmentUrl: `https://${noteStorage.getBucketName()}.s3.amazonaws.com/${noteId}`,
        ...CreateNoteRequest
    }
    await noteAccess.createNote(noteItem)
    return noteItem

}

//=========================================DELETE NOTE=========================
export async function deleteNote(event: APIGatewayProxyEvent) {
    const noteId = event.pathParameters.noteId
    const userId = getUserId(event)

    return await noteAccess.deleteNote(noteId, userId)
}

//=========================================GET NOTES========================
export async function getNotes(event: APIGatewayProxyEvent): Promise<NoteItem[]> {
    const userId = getUserId(event)
    return await noteAccess.getNotes(userId)
}

//========================================UPDATE NOTE==========================
export async function updateNote(event: APIGatewayProxyEvent) {
    const noteId = event.pathParameters.noteId
    const userId = getUserId(event)
    const updatedNote: UpdateNoteRequest = JSON.parse(event.body)
    const newNote = await noteAccess.updateNote(noteId, userId, updatedNote)
    return newNote
}

//=========================================GET NOTE helper========================
export async function getNote(event: APIGatewayProxyEvent) {
    const userId = getUserId(event)
    const noteId = event.pathParameters.noteId
    return await noteAccess.getNote(noteId, userId)
}

//=========================================GET URL========================
export async function generateUploadUrl(event: APIGatewayProxyEvent) {
    const bucket = noteStorage.getBucketName();
    const noteId = event.pathParameters.noteId;

    const createSignedUrlRequest = {
        Bucket: bucket,
        Key: noteId,
        Expires: 300
    }

    return noteStorage.getPresignedUploadURL(createSignedUrlRequest);
}
