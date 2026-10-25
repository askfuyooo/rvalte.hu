import { env } from "@rvalte-hu/config";
import { createClient } from "redis";
import { createLogger } from "@rvalte-hu/logger";

const logger = createLogger("redis", { module: "client" });

export const redisClient = createClient({
    socket: {
        host: env.redis.host,
        port: env.redis.port,
    },
    password: env.redis.password,
});

redisClient.on("error", (err) => {
    logger.error("Redis Client Error", err);
});

export const connectRedis = async () => {
    if (!redisClient.isOpen) await redisClient.connect();

    return redisClient;
};

export const disconnectRedis = async () => {
    if (redisClient.isOpen) await redisClient.quit();
};

export const getByKey = async (key: string) => {
    await connectRedis();
    const value = await redisClient.get(key);
    return value;
};

export const setByKey = async (
    key: string,
    value: string,
    ttlSeconds: number = 300,
) => {
    await connectRedis();
    await redisClient.set(key, value, {
        expiration: { type: "EX", value: ttlSeconds },
    });
};

export const deleteByKey = async (key: string) => {
    await connectRedis();
    await redisClient.del(key);
};
