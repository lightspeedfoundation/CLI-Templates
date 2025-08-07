### Contributing to CLI-Templates

Thank you for your interest in contributing a template! This guide explains how to add your template and submit a pull request.

---

### Requirements

- Your submission must be licensed under **GPL-3.0** or a license compatible with this repository’s GPL-3.0. Include a `LICENSE` in your template repo.
- Submissions must be your original work. **Direct plagiarism will not be accepted.**

---

### Add your template via the wizard (recommended)

1) Clone this repository

```bash
git clone https://github.com/lightspeedfoundation/CLI-Templates.git
cd CLI-Templates
```

2) Install dependencies

```bash
npm install
```

3) Run the wizard

```bash
npm run wizard
```

You will be asked for:
- Category: AI, App, Bot, or Game
- Repository URL (and optional branch)
- Project X handle

The wizard will create a new JSON file in `templates/entries/`, validate it, and create a new git branch with a commit. You can optionally let it help you open a pull request from your terminal (requires being authenticated with Git and optionally GitHub CLI).

---

### Manual submission (alternative)

If you prefer not to use the wizard:

1) Create a new JSON file under `templates/entries/your-handle-or-slug.json` matching `templates/schema.json`.
2) Run validation locally:

```bash
npm run validate
```

3) Commit your change on a feature branch and push it to your fork.
4) Open a pull request against `lightspeedfoundation/CLI-Templates`.

---

### Pull request checklist

- [ ] My template repository is licensed under GPL-3.0 (or compatible)
- [ ] I attest this is my original work and not copied from others
- [ ] `npm run validate` passes locally
- [ ] I’ve provided a clear name, description, and correct links

---

### Code of Conduct

Please follow our `CODE_OF_CONDUCT.md`. Be respectful and constructive in all interactions.

