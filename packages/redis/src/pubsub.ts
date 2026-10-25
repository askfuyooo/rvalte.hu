import { redisClient, connectRedis } from "./client.js";
import { createLogger } from "@rvalte-hu/logger";

const logger = createLogger("redis", { module: "pubsub" });

export const redisPublisher = redisClient;
export const redisSubscriber = redisClient.duplicate();

redisPublisher.on("error", (err) => {
    logger.error("Redis Publisher Error", err);
});

redisSubscriber.on("error", (err) => {
    logger.error("Redis Subscriber Error", err);
});

export const connectPubSub = async () => {
    await connectRedis();
    if (!redisSubscriber.isOpen) await redisSubscriber.connect();
};

export async function publishEvent<T>(channel: string, payload: T) {
    await connectPubSub();

    await redisPublisher.publish(channel, JSON.stringify(payload));
}

export async function subscribeToEvent<T>(
    channel: string,
    callback: (payload: T) => void | Promise<void>,
) {
    await connectPubSub();

    await redisSubscriber.subscribe(channel, async (message) => {
        const parsed = JSON.parse(message) as T;
        await callback(parsed);
    });
}
