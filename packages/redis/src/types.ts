export type RedisEvent<T = unknown> = {
    type: string;
    payload: T;
    createdAt: string;
};
