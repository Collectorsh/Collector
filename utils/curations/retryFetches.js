export default function retryFetches(cb, maxAttempts = 10) {
  let attempts = 0;
  return new Promise((resolve, reject) => {
    const attempt = async () => {
      try {
        attempts++;
        const result = await cb();
        console.log(`🚀 ~ attempt${attempts} :`, result )
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