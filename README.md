### CLI-Templates

An open, collaborative registry of starter templates for building AI tools, apps, bots, and games that integrate with the Lightspeed CLI wallet.

Lightspeed CLI is an API-connected Web3 wallet that can integrate with any software stack (Rust, Python, JavaScript, TypeScript, Unity, Telegram, and more). Over time, validator support will be added for additional apps including X, Farcaster, and others. CLI gives builders and users full control over their wallets to execute swaps, bridging, transactions, deposits, and withdrawals on any interface, any view, and any application of CLI.

Get a CLI wallet here: (Link coming soon)

---

### What this repo is

- Community templates: A curated list of community-contributed project starters
- A guided wizard: A command-line wizard to add your template via a simple Q&A
- Automated checks: JSON schema validation and CI to keep submissions clean
- One-click PR flow: Optionally open a pull request directly from your terminal

---

### Quick start

- Clone the repo
  - `git clone https://github.com/lightspeedfoundation/CLI-Templates.git`
  - `cd CLI-Templates`
- Install dependencies
  - `npm install`
- Run the wizard
  - `npm run wizard`

The wizard will collect:
- Category: AI, App, Bot, or Game
- Repository URL (and optional branch)
- Project X handle

It will create a new JSON entry under `templates/entries/`, validate it, and optionally help you open a PR.

---

### Contributing

Please see `CONTRIBUTING.md` for detailed, step-by-step instructions. Summary:
- Ensure your template is properly licensed under GPL-3.0 (compatible with this repo)
- Run `npm run wizard` and follow prompts
- Submit a PR when ready

Plagiarism is not accepted. Do not submit templates that directly copy others' work.

---

### Project structure

- `bin/wizard.js` — interactive CLI to add a template entry
- `templates/entries/` — one JSON file per template submission
- `templates/schema.json` — JSON schema enforced by CI
- `scripts/validate.js` — schema validation utility
- `scripts/build-index.js` — optional index generator for all entries
- `.github/` — PR template and CI workflow

---

### Similar and related open-source efforts

Related projects to learn from for contributor UX and governance:
- Cookiecutter ecosystem and docs [`cookiecutter.readthedocs.io`](https://cookiecutter.readthedocs.io/en/stable/) and repo [`github.com/cookiecutter/cookiecutter`](https://github.com/cookiecutter/cookiecutter)
- Yeoman generators and discovery [`yeoman.io`](https://yeoman.io/) and generators list [`yeoman.io/generators`](https://yeoman.io/generators/)
- Template registries such as Adobe Template Registry [`github.com/adobe/aio-template-submission`](https://github.com/adobe/aio-template-submission) and Cloudflare Template Registry [`github.com/cloudflare/template-registry`](https://github.com/cloudflare/template-registry)

We aim to be collaboratively competitive: approachable like curated lists, but with a structured schema and automated validation to keep quality high.

---

### License

This repository is licensed under GPL-3.0. See `LICENSE` for details.