import toast from "react-hot-toast";

export const error = (text, duration = 4000) =>
  toast(text, {
    duration,
    icon: "❌",
    style: {
      borderRadius: "10px",
      background: "#F8D7DA",
      color: "#842029",
      border: "1px #842029 solid",
    },
  });

export const warning = (text, duration = 4000) =>
  toast(text, {
    duration,
    icon: "⚠️",
    style: {
      borderRadius: "10px",
      background: "#FFA500", //orange
      color: "#842029",
      border: "1px #842029 solid",
    },
  });

export const success = (text, duration = 4000) =>
  toast(text, {
    duration,
    icon: "🎉",
    style: {
      borderRadius: "10px",
      background: "#D1E7DD",
      color: "#2F4E35",
      border: "1px #2F4E35 solid",
    },
  });
