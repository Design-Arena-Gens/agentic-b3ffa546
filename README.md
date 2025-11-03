# Nebula Projects – Command Center

Nebula Projects is a portfolio command center for project, milestone, and team orchestration. The dashboard includes:

- Kanban delivery boards with filtering and inline status/priority management
- Portfolio pulse table with progress, health state, and ownership context
- Milestone radar, activity feed, and team capacity insights
- Quick-add workflows to capture new backlog items instantly

Built with the Next.js App Router, TypeScript, and Tailwind CSS. Fully client-side for frictionless deployment on Vercel.

## Getting Started

Install dependencies and run the local dev server:

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to interact with the workspace. Edits in `src/app/page.tsx` hot reload automatically.

## Available Scripts

- `npm run dev` – start the development server
- `npm run build` – create a production build
- `npm run lint` – run ESLint checks

## Deployment

The app is optimized for Vercel. Trigger a production deployment with:

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-b3ffa546
```

After deploy, verify the production environment via:

```bash
curl https://agentic-b3ffa546.vercel.app
```
