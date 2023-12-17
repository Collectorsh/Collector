import { ClipboardCopyIcon, CheckIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { useState, useEffect } from "react";

const CopyButton = ({ textToCopy, className }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
  };

  useEffect(() => {
    let timeout;
    if (copied) {
      timeout = setTimeout(() => {
        setCopied(false);
      }, 5000);
    }
    return () => clearTimeout(timeout);
  }, [copied]);

  return (
    <button
      className={clsx("p-2 rounded flex items-center space-x-2 hover:scale-110 active:scale-100 duration-300", className)}
      onClick={() => copyToClipboard(textToCopy)}
    >
      {copied ? (
        <CheckIcon className="h-6 w-6 text-emerald-500" />
      ) : (
        <ClipboardCopyIcon className="h-6 w-6" />
      )}
    </button>
  );
};

export default CopyButton; 