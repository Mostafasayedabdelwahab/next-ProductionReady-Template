import { Duration, Ratelimit } from "@upstash/ratelimit";
import { ERROR_CODES } from "@/config/errors";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function checkRateLimit(
  type: keyof typeof rateLimits,
  key: string,
) {
  const limiter = rateLimits[type];

  const { success } = await limiter.limit(key);

  if (!success) {
    return {
      success: false,
      code: ERROR_CODES.TOO_MANY_REQUESTS,
    };
  }

  return { success: true };
}

// 🔹 Factory function
function createRateLimiter(limit: number, window: Duration) {
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, window),
  });
}

export const rateLimits = {
  // strict (password / login)
  auth: createRateLimiter(5, "30s"),

  login: createRateLimiter(10, "10m"),

  // medium (profile update)
  user: createRateLimiter(10, "30s"),

  // loose (normal APIs)
  api: createRateLimiter(20, "30s"),
};
