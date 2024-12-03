require('dotenv').config();
const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { url } = require('inspector');
const app = express();
const port = 1337;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/check-file', async (req, res) => {
    const { token, url: fileUrl, words } = req.body;
    const specificWords = words.split(',');

    try {
        res.json({
            message: 'File is being processed'
        });
        console.log('Downloading the file...');
        console.log('url:', fileUrl);
        // Download the file
        const response = await axios({
            url: fileUrl,
            method: 'GET',
            responseType: 'stream',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('downloaded');
        const filePath = './audio.mp3';
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        writer.on('finish', async () => {
            // Send the file to OpenAI Whisper API
            const form = new FormData();
            form.append('file', fs.createReadStream(filePath));
            form.append('model', 'whisper-1');

            console.log('sending to whisper');
            const whisperResponse = await axios.post('https://api.openai.com/v1/audio/transcriptions', form, {
                headers: {
                    ...form.getHeaders(),
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                }
            });

            console.log('recieved words:', whisperResponse.data.text);
            const transcript = whisperResponse.data.text;


            // Check for specific words
            const foundWords = specificWords.filter(word => transcript.includes(word));


            console.log('foundWords:', foundWords);
            if (foundWords.length > 0) {
                console.log('Sensitive information found');

                // Update the file metadata to add "sensitive: true"
                const artifactPath = fileUrl.split('/artifactory/')[1];
                await axios.put(`https://<YOUR_JFROG>.jfrog.io/artifactory/api/storage/${artifactPath}?properties=sensitive=true`, {
                    sensitive: true
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log('File metadata updated');
            }

            // Clean up the downloaded file
            fs.unlinkSync(filePath);
        });

        writer.on('error', (err) => {
            res.status(500).send('Error downloading the file');
        });
    } catch (error) {
        res.status(500).send('Error processing the request');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
