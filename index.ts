import { parseArgs } from "util";

const generateMapLayers = async (url: string, token: string) => {
  const response = await fetch(`${url}/?f=json&token=${token}`);
  const layers = await response.json();
  const sublayers = (layers.layers || layers.subLayers).filter(
    (layer: { parentLayerId: number }) => layer.parentLayerId === -1
  );

  return await Promise.all(
    sublayers.reverse().map(async (layer: { id: number }) => {
      return await generatePopupTemplate(url, layer.id, token);
    })
  );
};

const generatePopupTemplate = async (
  url: string,
  id: number,
  token: string
) => {
  const response = await fetch(`${url}/${id}?f=json&token=${token}`);
  const layer = await response.json();
  const sublayers = layer.layers || layer.subLayers;
  if (!sublayers || sublayers.length === 0) {
    return {
      title: layer.name,
      id: layer.id,
      visible: layer.defaultVisibility,
      popupTemplate: {
        title: `{${layer.displayField}}`,
        content: [
          {
            type: "fields",
            fieldInfos:
              layer.fields?.map((field: any) => {
                return {
                  fieldName: field.name,
                  label: field.alias,
                };
              }) || [],
          },
        ],
      },
    };
  } else {
    return {
      title: layer.name || layer.mapName,
      visible: layer.defaultVisibility,
      id: layer.id,
      sublayers: await Promise.all(
        sublayers
          .reverse()
          .map(
            async (sublayer: any) =>
              await generatePopupTemplate(url, sublayer.id, token)
          )
      ),
    };
  }
};

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
