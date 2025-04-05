# monorepo-template

**React Register Form Template** powered with:
- `React` with `Zustand` state management,
- `Vite` bundler
- `Material-UI (MUI)` for a clean and responsive design.
- `Typescript` typings
- `Zod` schema validation
- `I18next` localisation support
- `ESLint` lint, fix, coverage
- `Prettier` lint, fix, organize imports
- Pre-commit `hook` with lint staged
- `Editor config`
- `Playwright`, `Vitest` unit and e2e tests and coverage
- `NPM` check updates

## Tech Stack
- **Client**: React 19, Zustand, Material UI, I18next, Typescript, Zod
- **Bundle**: Node.js, Vite
- **Testing**: Playwright, Vitest
- **Code Quality**: ESLint, Prettier, pre-commit hooks, lint-staged

## Commands

### Installation

Install NPM dependencies

`npm install` Install NPM dependencies

### Development

Start app in Development mode with hot reload.
The app will be available at `http://localhost:4200`.

`npm run start` Start the app

### Testing

Run the app first

`npm run test` Run client and e2e tests

`npm run test:component` Run component tests

`npm run test:e2e` Run end-to-end tests

`npm run test:watch` Run client and server tests in watch mode

`npm run test:coverage` Run client and server tests coverage report

### Build

Build client and server

`npm run build` Build client and server

### Code quality

Code quality checks and fixes

`npm run lint` Run code quality checks

`npm run lint:fix` Run code quality fixes

`npm run update` Update libraries to the latest versions