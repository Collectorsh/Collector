import apiClient from "/data/client/apiClient";
import imageExists from "image-exists";

export function addDefaultSource(e, mint, url) {
  imageExists(url, function (exists) {
    if (exists) {
      e.target.src = url;
      try {
        let images = [{ uri: url, mint: mint }];
        apiClient.post("/images/upload", {
          images: images,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      e.target.src = null;
    }
  });
}
