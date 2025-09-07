# AI Studio

## Installation

```bash
git clone https://github.com/MehakB7/ai-studio.git
cd ai-studio
npm install
```

## Technologies Used

- **shadcn/ui**: Modern, accessible React UI components.
- **Jest**: Unit and integration testing.
- **ESLint**: Code linting and style enforcement.
- **Husky**: Git hooks for pre-commit linting and tests.
- **Playwright**: End-to-end browser testing.

## Usage

Start the development server:

```bash
npm run dev
```

## Testing

Run all tests with:

```bash
npm  run test
```

## Linting

Check code style and errors:

```bash
npm run lint
```

## Git Hooks

Husky is configured to run linting and tests before commits to ensure code quality.

## End-to-End Testing (Playwright)

Playwright is used for end-to-end browser testing. It helps ensure your app works as expected across different browsers.

### Playwright Scripts

- `npx playwright test` — Runs all Playwright tests in the `e2e/` directory.
- `npx playwright test --ui` — Opens the Playwright Test UI for interactive test runs and debugging.
- `npx playwright codegen <url>` — Opens the Playwright code generator to record user actions and generate test scripts for a given URL.
- `npx playwright show-report` — Opens the HTML report for the latest test run (found in `playwright-report/`).

Test results and traces are stored in the `test-results/` and `playwright-report/` folders for debugging and analysis.


## Deployment & CI/CD

This project uses **Vercel** for deployment and **GitHub Actions** for CI/CD automation.

- **Vercel**: Deploys the app to production. (Free tier allows only one domain.)
- **GitHub Actions**: Automates testing and deployment workflows.

### E2E Testing & Production Push

Due to Vercel's free tier limitations, end-to-end (E2E) tests are run after merging the `main` branch to production. In a typical production setup, E2E tests would run before pushing to production to catch issues early.
