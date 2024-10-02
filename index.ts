import { parseArgs } from "util";
import { generateMapLayers } from "./generateMapLayers";

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    url: {
      type: "string",
    },
    token: {
      type: "string",
    },
    output: {
      type: "string",
      default: "popupTemplate.json",
    },
    help: {
      type: "boolean",
      short: "h",
    },
  },
  strict: true,
  allowPositionals: true,
});

const { output, token, url, help } = values;

if (help || (!url && !token)) {
  console.log(`
  Usage: bun start --url <url> --token <token> --output <output>

  Options:
    --url     URL of the feature service ending. Example: https://{domain}/{web_adapter}/rest/services/{service}/MapServer
    --token   Token for the feature service requested with referrer as the client. Refer to the [documentation](https://developers.arcgis.com/rest/users-groups-and-items/generate-token/)
    --output  Output file name. Example: popupTempalte.json
  `);
  process.exit(0);
}

const popupTemplate = await generateMapLayers(url!, token!);

await Bun.write(output!, JSON.stringify(popupTemplate, null, 2));
