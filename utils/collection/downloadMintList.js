import download from "downloadjs";

export function downloadMintList(e, tokens) {
  e.preventDefault();

  var list = [];
  tokens.map((token) => {
    if (token.visible === true) {
      list.push(token.mint);
    }
  });
  download(
    JSON.stringify(list, undefined, 2),
    "mintlist.json",
    "application/json"
  );
}
