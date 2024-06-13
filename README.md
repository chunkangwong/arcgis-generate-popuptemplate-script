# generate-popup-template-script

To install dependencies:

```bash
bun install
```

Prepare .env file with the following content:

```bash
API_KEY=your_api_key    # API key generated with referer as client
URL=your_map_server_url # e.g. https://{domain}/{server_adapter}/rest/services/{service_name}/MapServer
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.4. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
