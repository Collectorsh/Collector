import zIndex from "@material-ui/core/styles/zIndex";
import confetti from "canvas-confetti";

const randomInRange = (min, max) => {
  return Math.random() * (max - min) + min;
}
export const shootConfetti = async (count = 1) => {
  const maxCount = Math.min(count, 10)
  const speed = 1500 / maxCount
  const pause = () => new Promise((resolve) => setTimeout(() => resolve("confetti good"), speed))
  for (let i = 0; i < maxCount; i++) {
    confetti({
      angle: randomInRange(50, 120),
      spread: randomInRange(60, 80),
      particleCount: randomInRange(100, 200),
      origin: { y: 0.5 },
      zIndex: 1002
    });
    confetti({
      angle: randomInRange(50, 120),
      spread: randomInRange(60, 80),
      particleCount: randomInRange(100, 200),
      origin: { y: 0.6 },
      zIndex: 1002
    });
    if (i < maxCount - 1) {
      await pause()
    }
  }
}