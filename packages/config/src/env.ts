import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

if (process.env.NODE_ENV !== "production") {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const envPath = path.resolve(__dirname, "../../../.env");
    dotenv.config({ path: envPath });
}

const required = (key: string, defaultValue?: string): string => {
    const value = process.env[key];
    if (!value) {
        if (defaultValue !== undefined) return defaultValue;

        throw new Error(`Environment variable ${key} is not set`);
    }

    return value;
};

const convertUrl = (url: string): string => {
    let normalizedUrl = url.trim();
    try {
        const parsedUrl = new URL(normalizedUrl);
        normalizedUrl = parsedUrl.toString();
    } catch (error) {
        throw new Error(`Invalid URL: ${url}`);
    }

    if (!normalizedUrl.endsWith("/")) normalizedUrl += "/";

    return normalizedUrl;
};

export const env = {
    redis: {
        port: Number(process.env.REDIS_PORT ?? "6379"),
        password: required("REDIS_PASSWORD"),
        host: required("REDIS_HOST", "127.0.0.1"),
    },

    spotify: {
        baseUrl: convertUrl(
            required("SPOTIFY_BASE_URL", "https://api.spotify.com/v1"),
        ),
        tokenUrl: convertUrl(
            required(
                "SPOTIFY_TOKEN_URL",
                "https://accounts.spotify.com/api/token",
            ),
        ),
        clientId: required("SPOTIFY_CLIENT_ID"),
        clientSecret: required("SPOTIFY_CLIENT_SECRET"),
        artistId: required("SPOTIFY_ARTIST_ID"),
        artistBands: (process.env.SPOTIFY_ARTIST_BAND_IDS || "")
            .split(",")
            .map((pair) => pair.trim())
            .filter(Boolean)
            .map((pair) => {
                const [bandId, artistIds] = pair.split("_");

                if (!bandId || !artistIds) {
                    throw new Error(
                        `Invalid SPOTIFY_ARTIST_BAND_IDS format: ${pair}`,
                    );
                }

                return {
                    bandId,
                    artistIds: artistIds.split(":"),
                };
            }),
    },

    linktreeUrl: convertUrl(required("LINKTREE_URL")),
    backendPort: Number(process.env.BACKEND_PORT || "3000"),

    NODE_ENV: process.env.NODE_ENV || "development",
    LOG_LEVEL: process.env.LOG_LEVEL || "info",
};
