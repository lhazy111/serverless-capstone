import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { updateNote } from '../../helpers/notes'

export const handler: APIGatewayProxyHandler =
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const updatedNote = await updateNote(event);
    console.log("note update:", event)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ msg: "Note has been updated", updated: updatedNote })
    }

  }