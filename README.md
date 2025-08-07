### CLI-Templates

An open, collaborative registry of starter templates for building AI tools, apps, bots, and games that integrate with the Lightspeed CLI wallet.

Lightspeed CLI is an API-connected Web3 wallet that can integrate with any software stack (Rust, Python, JavaScript, TypeScript, Unity, Telegram, and more). Over time we will add validator support for other apps including X and Farcaster. CLI gives builders and users full control over their wallets to execute swaps, bridging, transactions, deposits, and withdrawals across interfaces.

Get a CLI wallet here: (Link coming soon)

---

### What this repo is

- Community templates: a curated list of community-contributed project starters
- Guided wizard: a friendly command-line wizard to add your template
- Automated checks: JSON Schema validation and CI to keep submissions clean
- Optional one-step PR: open a pull request from the terminal (if GitHub CLI is installed)

---

### TL;DR – contribute in 5 minutes

1) Fork this repo on GitHub
2) Clone and install
   - `git clone https://github.com/<you>/CLI-Templates.git`
   - `cd CLI-Templates`
   - `npm install`
3) Run the wizard and answer a few questions
   - `npm run wizard`
   - Use a real template repo URL that ends with `.git`
   - Use a simple Project X handle like `@your_handle`
4) Review + validate
   - The wizard writes a file in `templates/entries/your-slug.json`
   - `npm run validate`
5) Push a branch and open a PR
   - If the wizard created a branch for you, push it: `git push --set-upstream origin <branch-name>`
   - Open a PR on GitHub
   - Or, with GitHub CLI installed: `gh pr create --base main --title "Add template: <name>" --body "..."`

---

### What the wizard asks for

- Category: AI, App, Bot, or Game
- Template repository URL (must end with `.git`)
- Default branch or tag (optional)
- Project X handle (e.g., `@lightspeed_coin`)
- Name, one-line description, and optional tags

The wizard then:
- Creates `templates/entries/<slug>.json`
- Validates locally against `templates/schema.json`
- Creates a feature branch and optionally offers to open a PR

---

### Submission checklist

- Your template repository is licensed under GPL-3.0 (or compatible)
- Your entry JSON passes `npm run validate`
- The Project X handle is a simple handle (e.g., `@your_handle`), not a URL
- The repository URL points to your template (not this registry)
- It’s your original work (no direct copying)

See `CONTRIBUTING.md` for details.

---

### Troubleshooting

- Git won’t commit (identity unknown):
  - `git config user.name "Your Name"`
  - `git config user.email "you@example.com"`
- Wizard closed or you made a typo:
  - Re-run `npm run wizard` or edit your file in `templates/entries/` and run `npm run validate`
- “unknown format \"date-time\" ignored” in validation:
  - Info only; our validator intentionally ignores that format. Safe to continue if there are no errors.
- PR didn’t open automatically:
  - Install GitHub CLI and sign in: `winget install GitHub.cli` then `gh auth login`, rerun wizard or push branch and open PR on GitHub.

---

### Project structure

- `bin/wizard.js` — interactive CLI
- `templates/entries/` — one JSON file per submission
- `templates/schema.json` — JSON Schema used by the validator and CI
- `scripts/validate.js` — schema validation utility (`npm run validate`)
- `scripts/build-index.js` — optional index of all entries (`npm run build:index`)
- `.github/` — PR template and CI workflow

---

### Similar and related open-source efforts

Learnings and inspiration:
- Cookiecutter docs and repo: [`cookiecutter.readthedocs.io`](https://cookiecutter.readthedocs.io/en/stable/), [`github.com/cookiecutter/cookiecutter`](https://github.com/cookiecutter/cookiecutter)
- Yeoman and generator discovery: [`yeoman.io`](https://yeoman.io/), [`yeoman.io/generators`](https://yeoman.io/generators/)
- Template registries: Adobe [`github.com/adobe/aio-template-submission`](https://github.com/adobe/aio-template-submission), Cloudflare [`github.com/cloudflare/template-registry`](https://github.com/cloudflare/template-registry)

We aim to be collaboratively competitive: approachable like curated lists, with a structured schema and automated validation to keep quality high.

---

### License

This repository is licensed under GPL-3.0. See `LICENSE` for details.