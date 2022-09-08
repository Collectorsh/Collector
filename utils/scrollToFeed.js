export function scrollToFeed() {
  const yOffset = 0;
  const element = document.getElementById("feed");
  const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
  window.scrollTo({ top: y, behavior: "smooth" });
}
