# GitHub Copilot Instructions for the Automation Testing Project

## 🎯 Project Purpose

Automated testing for a web-based system using Playwright, following MCP principles:  
**Maintainability**, **Clarity**, and **Performance**.

## 🧱 Project Structure Guidelines

- Each system page should have its own Page Object class in the `pages/` directory.
- Test files should be located in the `tests/` directory.
- Test data and constants should be stored in the `data/` directory.
- Utility code (e.g., fixtures, helpers) belongs in `utils/`.

- Each test must include a clear title and a meaningful description.

## ✅ Code Style Rules

- All tests must be written in **JavaScript**.
- Avoid code duplication – reuse logic via functions and Page Objects.
- Use **descriptive and readable** variable and method names in **English**.
- Assertions must be clear and specific.

## ✏️ Test Examples to Generate

- A login test that verifies successful login and redirection to the homepage.
- A Page Object for a login page with: selectors, actions, and validation methods.

## 🧠 Copilot Behavior Expectations

- Prefer `data-testid` and role-based selectors over plain text when available.
- When asked to "test", "verify", or "assert" — include proper assertions.
- For prompts like "optimize this test" — refactor with readability in mind.
- When generating Page Objects — include reusable methods, not just selectors.

## 📊 Sample Prompt for Copilot

```JavaScript
// Test: Verify user can log in with valid credentials and lands on the homepage
```
