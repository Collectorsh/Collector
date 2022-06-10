import * as htmlToImage from "html-to-image";
import download from "downloadjs";

export async function exportAsPicture(e) {
  e.preventDefault();

  const filter = (node) => {
    return node.className !== "eye";
  };

  var el = document.getElementById("collectibles");
  el.classList.add("collage");

  await htmlToImage.toPng(el, { filter: filter }).then(function (dataUrl) {
    download(dataUrl, "collector.png", "image/png");
    el.classList.remove("collage");
  });
}
