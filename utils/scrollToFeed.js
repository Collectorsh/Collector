export function scrollToFeed() {
  const yOffset = -90;
  const element = document.getElementById("feed");
  const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
  window.scrollTo({ top: y, behavior: "smooth" });
}
