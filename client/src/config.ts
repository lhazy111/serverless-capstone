// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'eq88ewkhb4' //apiId =  
export const apiEndpoint = `https://${apiId}.execute-api.eu-west-1.amazonaws.com/dev`

export const authConfig = {
  domain: 'dev-y5-kxxnn.eu.auth0.com',            // Auth0 domain dev-y5-kxxnn.eu.auth0.com
  clientId: 'F1U8AVEUEevCooYuMFOQoNtVut3ovz6N',          // Auth0 client id F1U8AVEUEevCooYuMFOQoNtVut3ovz6N
  callbackUrl: 'http://localhost:3000/callback'
}
