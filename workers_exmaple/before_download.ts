export default async (context: PlatformContext, data: BeforeDownloadRequest): Promise<BeforeDownloadResponse> => {

    let status: DownloadStatus = DownloadStatus.DOWNLOAD_UNSPECIFIED;

    try {
        // The in-browser HTTP client facilitates making calls to the JFrog REST APIs
        //To call an external endpoint, use 'await context.clients.axios.get("https://foo.com")'
        
        // if its mp3 file
        if (data.metadata.repoPath.id.endsWith('mp3')) {
            console.log("Check mp3 file props")
            // get properties, if it has sensitive=true, then block
            // save repokey and path
            const repoKey = data.metadata.repoPath.key;
            const filePath = data.metadata.repoPath.path;
            //
            const res = await context.clients.platformHttp.get(`/artifactory/api/storage/${repoKey}/${filePath}?properties`);

            if (res.data.properties.sensitive && res.data.properties.sensitive[0] === 'true') {
                console.log('Sensitive file download attemp - blocking');
                status = DownloadStatus.DOWNLOAD_STOP;
            } else {
                status = DownloadStatus.DOWNLOAD_PROCEED;
            }
        }
        else {
            status = DownloadStatus.DOWNLOAD_PROCEED;
        }
    } catch (error) {
        // The platformHttp client throws PlatformHttpClientError if the HTTP request status is 400 or higher
        status = DownloadStatus.DOWNLOAD_PROCEED;
        if (error.status === 404) {
            console.log('No props exists')
        }
        else {
            console.error(`Request failed with status code ${error.status || '<none>'} caused by : ${error.message}`)
        }

    }
    return {
        status,
        message: 'Overwritten by worker-service if an error occurs.',
    }
}