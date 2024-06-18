# generate-popup-template-script

To install dependencies:

```bash
bun install
```

To run:

```bash
bun start

Usage: bun start --url <url> --token <token> --output <output>

Options:
  --url     URL of the feature service ending. Example: https://{domain}/{web_adapter}/rest/services/{service}/MapServer
  --token   Token for the feature service requested with referrer as the client. Refer to the [documentation](https://developers.arcgis.com/rest/users-groups-and-items/generate-token/)
  --output  Output file name. Example: popupTempalte.json
```

This project was created using `bun init` in bun v1.1.4. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
