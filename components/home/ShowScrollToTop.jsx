import React, { useEffect } from "react";

export default function ShowScrollToTp() {
  useEffect(() => {
    window.addEventListener(
      "scroll",
      function () {
        if (window.scrollY > 2000) {
          document.getElementById("scroll-to-top").style.visibility = "visible";
        } else {
          document.getElementById("scroll-to-top").style.visibility = "hidden";
        }
      },
      false
    );
  }, []);

  return null;
}
