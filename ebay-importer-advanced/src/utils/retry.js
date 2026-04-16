const delay = require('./delay');

async function retry(fn, options = {}) {
  const retries = options.retries ?? 3;
  let waitMs = options.initialDelayMs ?? 2000;
  const factor = options.factor ?? 2;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      const status = error?.response?.status;
      const retriable = !status || status === 429 || status >= 500;
      if (attempt === retries || !retriable) {
        throw error;
      }
      await delay(waitMs);
      waitMs *= factor;
    }
  }
}

module.exports = retry;
