# Quai Vault WWW

Marketing and documentation website for [Quai Vault](https://quaivault.org), a decentralized multisig wallet for the Quai Network.

## Tech Stack

- **React 19** + TypeScript
- **Vite 7** (build tooling)
- **Tailwind CSS 4** (styling)
- **Three.js** via React Three Fiber (3D background)
- **React Router 7** (client-side routing)
- **Supabase** (live vault stats)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_SITE_URL` | Marketing site URL | `https://quaivault.org` |
| `VITE_APP_URL` | Vault web application URL | `https://testnet.quaivault.org` |
| `VITE_GITHUB_REPO` | GitHub repo (`owner/repo`) | `Quai-Vault/quai-multisig-www` |
| `VITE_SUPABASE_URL` | Supabase project URL | — |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | — |
| `VITE_SUPABASE_SCHEMA` | Supabase schema for stats queries | `testnet` |

Supabase variables are optional. If not configured, the homepage displays placeholder stats instead of live data.

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── components/
│   ├── Navbar.tsx          # Header navigation with theme toggle
│   ├── Footer.tsx          # Site footer
│   ├── VaultScene.tsx      # Three.js 3D background
│   └── DocLayout.tsx       # Shared documentation page layout
├── contexts/
│   └── ThemeContext.tsx     # Dark/light mode state
├── pages/
│   ├── Home.tsx            # Landing page with live stats
│   ├── About.tsx           # Features and philosophy
│   └── docs/
│       ├── DocsIndex.tsx       # Documentation hub
│       ├── GettingStarted.tsx  # Getting started guide
│       ├── MultisigWallets.tsx # Multisig concepts
│       ├── Modules.tsx         # Extension modules
│       ├── FrontendGuide.tsx   # UI/UX guide
│       ├── DeveloperGuide.tsx  # Developer integration
│       ├── Security.tsx        # Security & audits
│       └── FAQ.tsx             # FAQ
├── services/
│   └── stats.ts            # Supabase stats fetching
├── config.ts               # Centralized configuration
├── App.tsx                  # Router setup
├── main.tsx                 # Entry point
└── index.css               # Tailwind theme & custom styles
```

## Deployment

The site is deployed on **Vercel** with SPA rewrites and security headers (CSP, HSTS, X-Frame-Options). See `vercel.json` for the full configuration.

## License

[MIT](LICENSE)
