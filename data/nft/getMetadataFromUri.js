import axios from "axios";

async function getMetadataFromUri(token) {

  let uri = token.uri;

  if (!uri) { 
    const nftURI = await hellomoonClient.post("/v0/nft/mint_information", {
      nftMint: token.mint,
    }).then(res => res.data.data[0].nftMetadataJson.uri)
    uri = nftURI;
  }

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
