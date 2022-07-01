export function gridItemImageSize(size) {
  switch (size) {
    case "small":
      return "w-[100px] h-[100px]";
    case "medium":
      return "w-[150px] h-[150px]";
    case "large":
      return "w-[200px] h-[200px]";
    default:
      return "";
  }
}
