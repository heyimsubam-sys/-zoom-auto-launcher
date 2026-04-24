# Contributing to Zoom Auto-Launcher

Thanks for your interest in contributing! Here's everything you need to know.

## Ground Rules

- Be respectful and constructive in all discussions
- One feature/fix per pull request
- Write clear commit messages (see below)
- Test your changes in Chrome before submitting

## Development Setup

1. Fork and clone the repo
2. Go to `chrome://extensions` → enable **Developer Mode** → **Load Unpacked** → select the project folder
3. Make your changes
4. Click the 🔄 reload icon on the extension card to reload

No build step required — it's plain HTML, CSS, and JS.

## Commit Message Format

Use this format:

```
type: short description

Optional longer explanation.
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
- `feat: add Google Calendar sync`
- `fix: recurring alarm not firing after browser restart`
- `docs: update publishing guide`

## Submitting a Pull Request

1. Create a branch: `git checkout -b feat/your-feature`
2. Make your changes and test them
3. Push: `git push origin feat/your-feature`
4. Open a PR with a clear title and description
5. Reference any relevant issues with `Fixes #123`

## Reporting Bugs

Open a GitHub Issue and include:
- Chrome version
- OS
- Steps to reproduce
- Expected vs actual behavior

## Feature Requests

Open a GitHub Issue with the `enhancement` label. Describe the use case, not just the solution.
