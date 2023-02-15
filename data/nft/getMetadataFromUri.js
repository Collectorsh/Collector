import axios from "axios";

async function getMetadataFromUri(token) {
  return axios.get(token.uri).then((response) => {
    token.image = response.data.image || null;
    token.description = response.data.description || null;
    token.properties = response.data.properties || null;
    token.symbol = response.data.symbol || null;
    token.name = response.data.name || null;
    return token;
  });
}

export default getMetadataFromUri;
