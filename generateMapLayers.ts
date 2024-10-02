export const generateMapLayers = async (url: string, token: string) => {
  const response = await fetch(`${url}/?f=json&token=${token}`);
  if (!response.ok) {
    console.error(response);
    throw new Error(`Failed to fetch layer: ${url}`);
  }
  const layers = await response.json();
  if (layers.error) {
    console.error(layers.error);
    throw new Error(`Failed to fetch layer: ${url}`);
  }
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
  if (!response.ok) {
    console.error(response);
    throw new Error(`Failed to fetch layer with id ${id}`);
  }
  const layer = await response.json();
  if (layer.error) {
    console.error(layer.error);
    throw new Error(`Failed to fetch layer with id ${id}`);
  }
  const sublayers = layer.layers || layer.subLayers;
  if (!sublayers || sublayers.length === 0) {
    return {
      title: layer.name,
      id: layer.id,
      visible: layer.defaultVisibility,
      minScale: layer.minScale,
      maxScale: layer.maxScale,
      popupTemplate: {
        title: layer.name,
        actions:
          layer.relationships.length > 0
            ? [
                {
                  id: `active-layers-related-table`,
                  title: `Related Table`,
                  type: "button",
                  icon: "table",
                },
              ]
            : [],
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
