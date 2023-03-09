import { cdnImage } from "/utils/cdnImage";
import axios from "axios";

export const urlFromMint = async (mint, uri) => {
  var image = cdnImage(mint);
  try {
    let res = await fetch(image, { method: "HEAD" });
    if (res.ok) {
      return image;
    }
  } catch (err) {
    try {
      let res = await axios.get(uri);
      return res.data.image;
    } catch (err) {
      console.log(err);
    }
  }
};
