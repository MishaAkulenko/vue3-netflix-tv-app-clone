# Netflix TV App Clone

This project is a clone of the Netflix application interface, specifically adapted for Smart TV. The project was primarily created for a portfolio and is currently under development. The main feature of this application is the implementation of navigation and behavior typical for TVs controlled by a remote (D-pad). Focus can be moved using PC keyboard arrows.

## 🎬 Core Functionality and Features

The main business logic is concentrated in `NavigationManager.ts`.

- **Remote Control Navigation (TV Focus Logic)**: Implemented focus movement logic using keyboard keys (up, down, left, right, enter, esc), which emulates the behavior of a TV remote control. Mouse control is also possible, functioning like a standard web portal.
- **Content Distribution**: Support for different content categories with routing to `/home`, `/movies`, `/series`, and a custom My Netflix screen (`/my-netflix`) featuring "Continue Watching" lists.
- **Responsive Design and Resolution Stub**: Since the application is intended for large TV screens, proper functionality is currently designed only for screens wider than 1000px and without touch screens.
- **Multilingual Support (i18n)**: Configured interface internationalization (Ukrainian and English languages).
- **Theme Switching**: Includes two interface themes: dark and light.

## 🛠 Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API)
- **Programming Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **State Management**: [Pinia](https://pinia.vuejs.org/) + `pinia-plugin-persistedstate` to persist state
- **Routing**: [Vue Router](https://router.vuejs.org/)
- **Data Fetching**: [TanStack Vue Query](https://tanstack.com/query/latest/docs/vue/overview) and `Axios`
- **Localization**: [Vue I18n](https://vue-i18n.intlify.dev/)
- **Styling**: [SCSS / Sass](https://sass-lang.com/)
- **Linters and Formatting**: ESLint, Prettier

## 🚀 How to Run Locally

### Prerequisites
You must have **Node.js** installed (supported versions: 20.19.0+ or 22.12.0+).

### Launch Steps

1. Clone the repository or download the project files.
2. Install the dependencies using npm:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the local address (usually `http://localhost:5173`) in your browser.

> **Note**: Make sure your browser window width is over **1000px**, otherwise you will see a Resolution Stub warning screen, as the app is optimized for TV resolution only and requires a larger viewport.

## 🏗 Development Scripts

All available commands are described in `package.json`:

- `npm run dev` — starts the project in development mode.
- `npm run build` — creates an optimized production build (includes type checking via vue-tsc).
- `npm run preview` — runs a local server to preview the built production version.
- `npm run lint` — checks code quality using ESLint.
- `npm run format` — formats code using Prettier.