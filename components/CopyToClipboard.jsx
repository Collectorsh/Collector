import clsx from "clsx";
import { useState, useEffect } from "react";
import * as Icon from "react-feather";
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
      className={clsx("p-2 rounded-full flex items-center space-x-2 hoverPalette3", className)}
      onClick={() => copyToClipboard(textToCopy)}
    >
      {copied ? (
        // <CheckIcon className="h-6 w-6 text-emerald-500" />
        <Icon.Check strokeWidth={2.5} className="stroke-emerald-500" size={18} />
      ) : (
          // <ClipboardCopyIcon className="h-6 w-6" />
          <Icon.Copy strokeWidth={2.5} size={18} />
      )}
    </button>
  );
};

export default CopyButton; 