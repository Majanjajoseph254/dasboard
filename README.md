# ProjectHub — Project Management Dashboard

A modern, responsive project management dashboard built with **React**, **Vite**, **TypeScript**, and **Tailwind CSS**. All data is stored locally using `localStorage` — no backend required.

## Features

- **Authentication** — Sign up and log in with email/password (stored in `localStorage`)
- **Dashboard** — Overview of all your projects with stats (total, in-progress, completed, blocked)
- **Projects** — Create, edit, delete projects; filter by status and search by name/supervisor
- **Project Detail** — Full detail view for each project with inline editing
- **Profile** — Edit your personal profile (name, email, phone, role, department, bio)
- **Responsive Layout** — Sidebar on desktop, drawer on mobile
- **Status Badges** — Color-coded badges for all project statuses

### Project Statuses

`Planned` · `Pending` · `In Progress` · `Blocked` · `On Hold` · `Completed` · `Cancelled`

## Tech Stack

| Tool | Purpose |
|------|---------|
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [React 19](https://react.dev/) | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS v3](https://tailwindcss.com/) | Utility-first styling |
| [React Router v7](https://reactrouter.com/) | Client-side routing |
| [lucide-react](https://lucide.dev/) | Icons |
| [clsx](https://github.com/lukeed/clsx) | Conditional class names |

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Install & Run

```bash
# 1. Clone the repository
git clone https://github.com/Majanjajoseph254/dasboard.git
cd dasboard

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
# Output is in the dist/ folder

npm run preview   # Preview the production build locally
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── Textarea.tsx
│   ├── Modal.tsx
│   ├── Toast.tsx
│   ├── StatusBadge.tsx
│   └── Layout.tsx    # Sidebar + mobile drawer layout
├── hooks/
│   └── useAuth.tsx   # Auth context + provider
├── pages/
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── DashboardPage.tsx
│   ├── ProfilePage.tsx
│   ├── ProjectsPage.tsx
│   └── ProjectDetailPage.tsx
├── services/
│   ├── auth.ts       # User registration, login, session
│   ├── profile.ts    # Profile CRUD
│   └── projects.ts   # Projects CRUD
├── types/
│   └── index.ts      # Shared TypeScript types
├── App.tsx           # Root component + routing
├── main.tsx          # Entry point
└── index.css         # Tailwind base styles
```

## Routes

| Route | Description | Auth Required |
|-------|-------------|:---:|
| `/login` | Login page | ✗ |
| `/signup` | Create account | ✗ |
| `/dashboard` | Overview & stats | ✓ |
| `/projects` | Project list + CRUD | ✓ |
| `/projects/:id` | Project detail | ✓ |
| `/profile` | Edit profile | ✓ |

## localStorage Keys

| Key | Contents |
|-----|---------|
| `pm_users` | Array of registered users |
| `pm_session` | Currently logged-in user session |
| `pm_profile_<userId>` | User profile data |
| `pm_projects_<userId>` | User's projects array |

