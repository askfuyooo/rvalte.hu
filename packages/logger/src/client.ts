import pino from "pino";
import { env } from "@rvalte-hu/config";
import type { LoggerContext } from "./types.js";

const isProd = env.NODE_ENV === "production";
const level = env.LOG_LEVEL || "info";

export const createLogger = (service: string, context: LoggerContext = {}) =>
    pino({
        level,
        base: {
            service,
            ...context,
        },
        timestamp: pino.stdTimeFunctions.isoTime,
        transport: isProd
            ? undefined
            : {
                  target: "pino-pretty",
                  options: {
                      colorize: true,
                  },
              },
    });

export const logger = createLogger("app");
