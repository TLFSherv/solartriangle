import { RedisClientType } from '@redis/client'
import redis from 'redis'

let redisClient: RedisClientType | undefined;

export default async function getRedisClient() {
    try {
        if (redisClient?.isOpen) {
            return redisClient
        }
        redisClient = redis.createClient()
        redisClient.on('error', (err) => console.log('Redis client error', err));

        await redisClient.connect();
        return redisClient
    } catch (e: any) {
        console.error(e.message);
    }
}

export const myRedisClient = await getRedisClient();