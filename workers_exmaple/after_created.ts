export default async (context: PlatformContext, data: AfterCreateRequest): Promise<AfterCreateResponse> => {

    try {
     
        // Creating a short-live token for the operation
        let tokenResp = await context.clients.platformHttp.post("/access/api/v1/tokens", {
            "user_id": "audio_analysis",
            "expires_in": "300",
            "scope": "applied-permissions/groups:readers",
        });
        // Save the access token 
        const token = tokenResp.data.access_token;

        // if its mp3 file, start a login
        if (data.metadata.repoPath.id.endsWith('.mp3')) {
            //save the repokey from the request object
            const repoKey = data.metadata.repoPath.key;
            //save audioUrl that will be sent with my payload to the external service
            const audioUrl = `https://devreleplus.jfrog.io/artifactory/${repoKey}/${data.metadata.repoPath.path}`; 
            //set the payload
            const payload = {
                "token": context.platformToken,
                "url": audioUrl,
                "words": "secret,tokens,token,credentials,sensitive,Kajagoogoo,shy,toshay,hashhash,how,do,i"
            }
            // set service url const that will have the service url, can also be held inside a secret if i want 
            const serviceUrl = "https://c88c-94-188-248-83.ngrok-free.app/check-file";
            
            // fire the request to the external service with all the details
            const analyze = await context.clients.axios.post(serviceUrl, payload);

        }

    } catch (error) {
        // The platformHttp client throws PlatformHttpClientError if the HTTP request status is 400 or higher
        console.error(`Request failed with status code ${error.status || '<none>'} caused by : ${error.message}`)
    }
    
    return {
        message: 'proceed',
    }
}