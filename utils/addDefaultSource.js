import apiClient from "/data/client/apiClient";

export function addDefaultSource(e, mint, url) {
  e.target.src = url;
  try {
    let images = [{ uri: url, mint: mint }];
    apiClient.post("/images/upload", {
      images: images,
    });
  } catch (err) {
    console.log(err);
  }
}
