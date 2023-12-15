export default function retryFetches(cb, maxAttempts = 16) {
  let attempts = 0;
  return new Promise((resolve, reject) => {
    const attempt = async () => {
      try {
        attempts++;
        const result = await cb();
        if (!result) throw new Error("No result returned");
        resolve(result);
      } catch (err) {
        console.log(`Attempt ${attempts} failed: ${err.message}`)
        if (attempts >= maxAttempts) {
          reject(err);
        } else {
          setTimeout(attempt, 2000);
        }
      }
    };
    attempt();
  });
} 