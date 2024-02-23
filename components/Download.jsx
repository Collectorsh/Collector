import { useState } from "react";
import LoadingModal from "/components/LoadingModal";
import NotFound from "./404";

export default function Download({ url, text }) {
  return <NotFound />; //DEPRECATED - TO BE DELETED
  const [loading, setLoading] = useState(false);

  async function downloadFile() {
    setLoading(true);
    const image = await fetch(url);
    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);

    const link = document.createElement("a");
    link.href = imageURL;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setLoading(false);
  }

  return (
    <>
      <a onClick={downloadFile}>
        {/* <DownloadIcon
          className="h-6 w-6 inline cursor-pointer"
          aria-hidden="true"
        /> */}
        {text && <span>{text}</span>}
      </a>
      <LoadingModal
        open={loading}
        title="Downloading"
        content="Your file is downloading..."
        icon="download"
      />
    </>
  );
}
