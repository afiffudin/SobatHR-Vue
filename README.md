# sobathr-vue

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```






# HRIS Dashboard — React + TypeScript

A modern, responsive HRIS dashboard for managing employees, attendance, and Earned Wage Access (EWA). Built with a focus on clean frontend architecture, performance, and scalability.

**Live Demo:** https://curly-kissee-afif-dev-977fdaad.koyeb.app/#keahlian
**Portfolio:** https://curly-kissee-afif-dev-977fdaad.koyeb.app
**Author:** M. Afifudin Yusup — https://github.com/afiffudin

---

## ✨ Features

- **Employee Management** — Search, filter, and manage employee data
- **Attendance Dashboard** — Real-time attendance overview with date filtering
- **EWA / Payroll Overview** — Salary and earned wage access summary
- **Responsive Design** — Fully responsive, mobile to desktop
- **Reusable Components** — Clean component architecture, easy to scale
- **Type-Safe** — Full TypeScript, no `any` in core logic

## 🛠 Tech Stack

- **Frontend:** React.js + TypeScript + Vite
- **Styling:** Tailwind CSS
- **State Management:** React Hooks / Context
- **API:** REST API + Node.js
- **Database:** PostgreSQL
- **Deployment:** Docker + Koyeb / Vercel

## 📁 Project Structure

```bash
src/
├── components/      # Reusable UI components
├── pages/           # Dashboard, Employee, Attendance
├── hooks/           # Custom hooks
├── services/        # API calls
├── types/           # TypeScript types
└── App.tsx          # Main entry
