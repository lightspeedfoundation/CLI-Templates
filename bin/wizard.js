#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
// inquirer is ESM; import dynamically inside promptUser
const colors = require('yoctocolors-cjs');
const figlet = require('figlet');
const gradient = require('gradient-string');
const { execSync } = require('child_process');
const simpleGit = require('simple-git');

const REPO_OWNER = 'lightspeedfoundation';
const REPO_NAME = 'CLI-Templates';
const DEFAULT_BASE_BRANCH = 'main';

function toSlug(input) {
  return String(input || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 80) || crypto.randomBytes(4).toString('hex');
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadSchema() {
  const schemaPath = path.join(process.cwd(), 'templates', 'schema.json');
  return JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
}

async function promptUser() {
  // Fancy header
  const title = figlet.textSync('CLI Templates', { horizontalLayout: 'full' });
  console.log(gradient.atlas.multiline(title));
  console.log(colors.blueBright('» Community Template Submission «'));
  const { default: inquirer } = await import('inquirer');
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'category',
      message: 'Pick a category',
      choices: ['AI', 'App', 'Bot', 'Game']
    },
    {
      type: 'input',
      name: 'repoUrl',
      message: 'Template repository (git URL ending with .git)',
      validate: (v) => /^(https?:\/\/|git@).+\.git$/.test(v) || 'Please enter a valid Git URL ending with .git'
    },
    {
      type: 'input',
      name: 'branch',
      message: 'Default branch or tag (optional)',
      default: ''
    },
    {
      type: 'input',
      name: 'projectX',
      message: 'Project X handle (e.g., @yourhandle)',
      validate: (v) => /^@?[A-Za-z0-9_\.]+$/.test(v.trim()) || 'Enter a simple handle like @lightspeed_coin'
    },
    {
      type: 'input',
      name: 'name',
      message: 'Template name',
      validate: (v) => v && v.trim().length > 1 || 'Please enter a short name'
    },
    {
      type: 'input',
      name: 'description',
      message: 'One-line description (optional)',
      default: ''
    },
    {
      type: 'input',
      name: 'tags',
      message: 'Tags (comma-separated, optional)',
      filter: (v) => v.split(',').map((s) => s.trim()).filter(Boolean)
    },
    {
      type: 'confirm',
      name: 'confirmGPL',
      message: 'Confirm your template repository is GPL-3.0 licensed',
      default: true
    },
    {
      type: 'confirm',
      name: 'noPlagiarism',
      message: 'Confirm this is your original work (no direct copying)',
      default: true
    },
    // Review step
    {
      type: 'confirm',
      name: 'confirmReview',
      message: 'Review your answers on screen. Continue?',
      default: true
    },
    {
      type: 'confirm',
      name: 'submitPr',
      message: 'Open a pull request now (requires GitHub CLI auth)?',
      default: true
    }
  ]);

  if (!answers.confirmGPL) throw new Error('Submission must be GPL-3.0 licensed.');
  if (!answers.noPlagiarism) throw new Error('Submission must be original (no plagiarism).');
  return answers;
}

function buildEntry(answers) {
  const slugBase = toSlug(answers.name || answers.projectX || answers.repoUrl);
  const slug = slugBase || toSlug(answers.projectX);
  const nowIso = new Date().toISOString();
  const entry = {
    name: answers.name,
    slug,
    category: answers.category,
    repository: {
      url: answers.repoUrl,
      branch: answers.branch || undefined
    },
    projectXHandle: answers.projectX,
    description: answers.description || undefined,
    tags: Array.isArray(answers.tags) && answers.tags.length ? answers.tags : undefined,
    createdAt: nowIso
  };
  return { entry, filename: `${slug}.json` };
}

function writeEntryFile(entry, filename) {
  const dir = path.join(process.cwd(), 'templates', 'entries');
  ensureDir(dir);
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, JSON.stringify(entry, null, 2) + '\n');
  return filePath;
}

async function gitCommitAndBranch(filePath, slug) {
  const git = simpleGit(process.cwd());
  const branchName = `add-template/${slug}-${Date.now()}`;
  try {
    await git.checkout(DEFAULT_BASE_BRANCH);
  } catch (_) {}
  await git.checkoutLocalBranch(branchName);
  await git.add([filePath]);
  await git.commit(`feat(templates): add ${slug} template`);
  return branchName;
}

function tryGhPrCreate(branchName, title, body) {
  try {
    execSync('gh --version', { stdio: 'ignore' });
  } catch (_) {
    console.log(colors.yellow('GitHub CLI not detected. Skipping automatic PR creation.'));
    return false;
  }
  try {
    // Push current branch; may fail if remote permissions are missing
    try {
      execSync(`git push --set-upstream origin ${branchName}`, { stdio: 'inherit' });
    } catch (_) {
      console.log(colors.yellow('Direct push to origin failed. If this is not your fork, use a fork to open a PR.'));
    }
    // Attempt PR create using current repo context
    const prCmd = `gh pr create --title "${title}" --body "${body}" --base ${DEFAULT_BASE_BRANCH}`;
    execSync(prCmd, { stdio: 'inherit' });
    return true;
  } catch (err) {
    console.log(colors.yellow('Automatic PR creation failed. You can open a PR manually using the instructions below.'));
    return false;
  }
}

async function main() {
  try {
    const answers = await promptUser();
    if (!answers.confirmReview) {
      console.log(colors.yellow('Cancelled. Rerun `npm run wizard` to start over.'));
      return;
    }
    const { entry, filename } = buildEntry(answers);
    const { default: ora } = await import('ora');
    const spinner = ora({ text: 'Creating entry...', spinner: 'dots12' }).start();
    const filePath = writeEntryFile(entry, filename);
    spinner.succeed(colors.green(`Created entry: ${path.relative(process.cwd(), filePath)}`));

    // Validate against schema (best-effort; CI will also validate)
    try {
      const Ajv = require('ajv');
      const schema = loadSchema();
      const ajv = new Ajv({ allErrors: true, strict: false });
      const validate = ajv.compile(schema);
      const valid = validate(entry);
      if (!valid) {
        console.log(colors.red('Schema validation errors:'));
        console.log(validate.errors);
        process.exitCode = 1;
      } else {
        console.log(colors.green('Entry passed local schema validation.'));
      }
    } catch (e) {
      console.log(colors.yellow('Validation skipped (local validator error). CI will validate your entry.'));
    }

    const branchName = await gitCommitAndBranch(filePath, entry.slug);
    console.log(colors.green(`\nCreated branch: ${branchName}`));

    if (answers.submitPr) {
      const title = `Add template: ${entry.name} (${entry.slug})`;
      const body = [
        'If you have completed your template and it is properly licensed under GPL v3, submit your pull request to be listed.',
        '',
        'Note: Do not submit pull requests directly copying other peoples\' work. Direct plagiarism will not be accepted.',
        '',
        `Category: ${entry.category}`,
        `Repository: ${entry.repository.url}${entry.repository.branch ? ` (branch: ${entry.repository.branch})` : ''}`,
        `Project X handle: ${entry.projectXHandle}`
      ].join('\n');

      const created = tryGhPrCreate(branchName, title, body);
      if (!created) {
        console.log('\nTo submit your PR manually:');
        console.log('1) Fork this repo on GitHub');
        console.log(`2) Push your branch: git push --set-upstream origin ${branchName}`);
        console.log('3) Open a PR against lightspeedfoundation/CLI-Templates with base=main');
      }
    } else {
      console.log('\nYou can submit your PR later with:');
      console.log(`git push --set-upstream origin ${branchName}`);
    }

    console.log(colors.cyan('\nThank you for contributing to CLI-Templates!'));
  } catch (err) {
    console.error(colors.red(`Error: ${err.message}`));
    process.exit(1);
  }
}

main();


