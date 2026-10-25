export type LoggerContext = {
    service?: string;
    module?: string;
    [key: string]: unknown;
};
