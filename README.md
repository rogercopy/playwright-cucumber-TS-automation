
```markdown
# Playwright Cucumber Project

This project uses Playwright and Cucumber for end-to-end testing of Trello functionalities.

## Prerequisites

1. Install [Node.js](https://nodejs.org/) (version 20 or higher is recommended).
2. Install [Git](https://git-scm.com/).
3. Clone this repository:
   ```bash
   git clone https://github.com/your-repo-url/playwright-cucumber.git
   cd playwright-cucumber
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables to the `.env` file:
     ```env
     TRELLO_API_KEY=your_trello_api_key
     TRELLO_API_TOKEN=your_trello_api_token
     TRELLO_BOARD_ID=your_trello_board_id
     TRELLO_BOARD_LIST_ID=your_trello_board_list_id
     TRELLO_LOGIN_EMAIL=your_trello_email
     TRELLO_LOGIN_PASSWORD=your_trello_password
     TRELLO_2FA_SETUP_KEY=your_trello_2fa_setup_key
     ```

## Running Tests

### Run All Tests
To execute all tests:
```bash
npm test
```

### Run API Tests
To execute API tests:
```bash
npm run test:crud
```

### Run UI Tests
To execute UI tests:
```bash
npm run test:ui
```

### Run UI Tests in CI Mode
To execute UI tests in CI mode:
```bash
npm run test:ui:ci
```

## Test Results
- Test results will be saved in the `test-results/` directory.
- Playwright reports will be saved in the `playwright-report/` directory.

## Debugging
- To debug tests, run them in headed (non-headless) mode — the browser window will be visible:
  ```bash
  npm run test:ui
  ```
  (The `test:ui` script sets `HEADLESS=false`.)
- To force headless mode locally (matches CI behavior):
  ```bash
  HEADLESS=true npm run test:ui
  ```

## Additional Notes
- Ensure that the `.env` file is not committed to version control by keeping it listed in `.gitignore`.
- For CI/CD, set the environment variables in your CI pipeline configuration (e.g., GitHub Actions).

```


