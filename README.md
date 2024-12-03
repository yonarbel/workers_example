
# JFrog Workers Example: External Service Integration and Custom Workers

This repository contains examples of how to extend the **JFrog Platform** using the **Workers** service. The examples demonstrate integrating an external service for detecting sensitive content and creating two custom Workers to enhance security and workflow control.

## Overview

**Workers** in the JFrog Platform enable you to execute custom code within execution flows. These examples include:
1. **External Service**: A Node.js-based service that analyzes files for sensitive words using OpenAI Whisper.
2. **After Create Worker**: A Worker that processes newly uploaded files, marking those containing sensitive content.
3. **Before Download Worker**: A Worker that blocks the download of files marked as sensitive.

## Repository Structure

```
.
├── package.json
├── server.js
├── workers_example/
│   ├── after_created.ts
│   ├── before_download.ts
│   └── README.md
└── README.md
```

### Contents

1. **`server.js`**
   - A lightweight Node.js service that uses OpenAI Whisper to detect sensitive content.
   - Automatically invoked by the "After Create Worker" to scan uploaded files.

2. **`workers/`**  
   - **`after_created.ts`**: A Worker that scans newly created files, calling the external service to detect sensitive words and marking files with properties if sensitive content is found.
   - **`before_download.ts`**: A Worker that prevents the download of files flagged with sensitive properties.

---

## How to Use

### 1. Set Up the External Service
1. Navigate to the `server.js` file:

2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the service:
   ```bash
   node server.js
   ```
4. The service runs locally on port `1337` by default. You can configure this in the `server.js` file.

### 2. Configure Workers in the JFrog Platform
1. **After Create Worker**:
   - Upload the `after_created.ts` file to the JFrog Platform Workers editor.
   - Adjust the `EXTERNAL_SERVICE_URL` variable to point to your running external service.

2. **Before Download Worker**:
   - Upload the `before_download.ts` file to the Workers editor.
   - Enable the Worker to ensure it runs on download events.

3. Save and enable both Workers in the JFrog Platform.

---

## Example Scenarios

### After Create Worker
1. A user uploads a file to the repository.
2. The Worker triggers the external service to scan the file.
3. If sensitive content is detected, the file is marked with a `sensitive: true` property.

### Before Download Worker
1. A user attempts to download a file.
2. The Worker checks if the file has the `sensitive: true` property.
3. If flagged, the download is blocked.

---

## Dependencies

- **Node.js** (for the external service)
- **TypeScript** (for Worker code)

---

## Contributing

We welcome contributions! Feel free to open issues, create pull requests, or suggest improvements.

---

## Questions?

If you have any questions or feedback, please reach out or open an issue in this repository.

---

**Happy coding! 🚀**
