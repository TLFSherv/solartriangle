import { RateLimiterRedis } from "rate-limiter-flexible";
import { myRedisClient } from "./redis";

export const rateLimiter = new RateLimiterRedis({
    storeClient: myRedisClient,
    useRedisPackage: true,
    keyPrefix: 'rl:dashboard',
    points: 10,
    duration: 60
});