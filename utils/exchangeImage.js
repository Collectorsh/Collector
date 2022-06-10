export function exchangeImage(url) {
  try {
    let filename = url.split("/").pop();
    if (url.indexOf("ipfs") > -1) filename = "ipfs/" + filename.split(".")[0];
    let exchange =
      "https://images.exchange.art/tr:q-100,w-1000,dpr-1/" + filename;
    return exchange;
  } catch (err) {
    console.log(err);
    return url;
  }
}
