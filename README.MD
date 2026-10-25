# rvalte.hu

A fan-made website for **Valter**, bringing together his music, socials, and a visual timeline of his journey as an artist - all in one place.

## About

This is a personal full-stack project that I build and maintain independently. It uses React for the frontend and Node.js for the backend, along with a few supporting packages for Redis caching, configuration, and logging.

The backend has a custom API that fetches and processes data from Spotify, plus a scraper that extracts links directly from a Linktree page.

### Behind the project

- **Frontend:** Built with the help of AI tools. I handled the integration, reviewed the changes, and put everything together in the final version. Let's just say design isn't my strongest skill. :)
- **Backend and supporting packages:** Designed and implemented independently by **Fuyooo**.

## Features

- Responsive, dark-themed fan page
- Hero section with video and visuals
- Artist social links pulled directly from Linktree
- Music release timeline powered by Spotify data
- Loading skeletons and local fallback data when the API is unavailable
- ⚡ Redis-powered caching for faster API responses
- Docker Compose deployment with Caddy reverse proxy support

## Project structure

```text
apps/
  backend/                 Express API
  frontend/                React + Vite frontend

packages/
  config/                  Environment configuration
  logger/                  Shared logging utility
  redis/                   Redis client and pub/sub helpers
  spotify-api/             Spotify API integration
  linktree-scraper-api/    Linktree scraping and link extraction

compose.yml                Docker Compose setup
.env.example               Example environment variables
```

## Tech stack

- **Frontend:** React, TypeScript, Vite, and Framer Motion
- **Backend:** Node.js, TypeScript, and Express
- **Integrations:** Spotify Web API and Linktree scraper
- **Caching:** Redis
- **Deployment:** Docker Compose with Caddy reverse proxy support

## Local development

### Requirements

- **Node.js:** 22.12+ recommended (required for Vite 8 compatibility)
- **npm:** For installing dependencies and running scripts
- **Redis:** Required when running the backend outside Docker

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Open `.env` and fill in the required values:

| Variable | Description |
| --- | --- |
| `SPOTIFY_CLIENT_ID` | Your Spotify app's client ID |
| `SPOTIFY_CLIENT_SECRET` | Your Spotify app's client secret |
| `SPOTIFY_ARTIST_ID` | Spotify artist ID used by the website |
| `LINKTREE_URL` | Linktree page to fetch social links from |
| `REDIS_PASSWORD` | Password for your Redis instance |
| `REDIS_HOST` | Redis hostname (`127.0.0.1` for local development) |
| `REDIS_PORT` | Redis port (usually `6379`) |
| `BACKEND_PORT` | Port the backend listens on (usually `3000`) |
| `SPOTIFY_ARTIST_BAND_IDS` | Optional mapping for older releases uploaded under different Spotify artist profiles |

The Spotify API URLs are already configured in `.env.example`, so there's no need to set them manually unless you want to change them.

**A few things to keep in mind:**
- Never commit your `.env` file to version control.
- Don't share or publish your Spotify client secret or other sensitive values.
- Make sure Redis is running and the connection settings match your setup.

### 3. Build packages

Build the shared packages required by the backend:

```bash
npm run build
```

Run this from the repository root before starting the development servers.

### 4. Start the development servers

```bash
npm run dev
```

Or start them individually:

```bash
npm run dev:backend
npm run dev:frontend
```

## Docker deployment

After configuring `.env` with valid credentials and a strong, non-empty `REDIS_PASSWORD`, build and start the stack:

```bash
docker compose up -d --build
```

Check the running services and view their logs:

```bash
docker compose ps
docker compose logs --tail=100
```

The included Caddy configuration is set up for `rvalte.hu`. To deploy on that domain, point its DNS records to your server and make ports **80** and **443** reachable so HTTPS can be provisioned.

If you're deploying to a different domain, review `compose.yml` and the environment settings first.

## Disclaimer

This project is provided **as is** for personal and informational purposes, with no guarantees of availability, accuracy, or continued operation. External services like Spotify, Linktree, hosting providers, and domain registrars may change or stop working at any time. I'm not responsible for service outages, inaccurate data, deployment issues, or any damages resulting from using or deploying this project. Use it at your own risk, and keep your credentials secure.

This is an independent fan project and is **not affiliated with or officially endorsed by Valter, Spotify, or Linktree**. All third-party names, logos, images, videos, music, and other content remain the property of their respective owners.

## Ownership and takedown requests

The `rvalte.hu` website is an independent fan project created to support the community and bring together publicly available information about **Valter**. It is not affiliated with or officially endorsed by Valter or his representatives.

All third-party content remains the property of its respective owners.

If Valter or his representatives would like any content removed or wish to take over the project and/or the `rvalte.hu` domain, I'm more than happy to cooperate. We can arrange the details of the project, repository, hosting, and domain transfer directly.

For inquiries, takedown requests, or discussions about ownership or domain transfer, please email **[adamtoth1215@gmail.com](mailto:adamtoth1215@gmail.com)**.

Please note that transferring the project or domain does not automatically include access to associated accounts, credentials, or infrastructure. These would need to be discussed separately.

## License

MIT

## Credits

The frontend was developed with the help of AI tools, while the backend and supporting packages were designed and implemented independently by **Fuyooo**.

> **Made with ❤️ by Fuyooo.**