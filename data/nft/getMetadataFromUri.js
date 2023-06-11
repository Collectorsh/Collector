import axios from "axios";

async function getMetadataFromUri(token) {
  return axios.get(token.uri).then((response) => {
    return {
      ...token,
      image: response.data.image || null,
      description: response.data.description || null,
      properties: response.data.properties || null,
      symbol: response.data.symbol || null,
      name: response.data.name || null,
      animation_url: response.data.animation_url || null,
    }
  });
}

export default getMetadataFromUri;
