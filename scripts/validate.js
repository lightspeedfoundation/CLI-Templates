const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

const ROOT = process.cwd();
const SCHEMA_PATH = path.join(ROOT, 'templates', 'schema.json');
const ENTRIES_DIR = path.join(ROOT, 'templates', 'entries');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function* walkJsonFiles(dir) {
  if (!fs.existsSync(dir)) return;
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (entry.isFile() && entry.name.endsWith('.json')) yield full;
    }
  }
}

function main() {
  const schema = readJson(SCHEMA_PATH);
  const ajv = new Ajv({ allErrors: true, strict: false });
  const validate = ajv.compile(schema);
  let errors = 0;
  for (const file of walkJsonFiles(ENTRIES_DIR)) {
    const data = readJson(file);
    const ok = validate(data);
    if (!ok) {
      console.error(`Schema errors in ${path.relative(ROOT, file)}:`);
      console.error(validate.errors);
      errors++;
    }
  }
  if (errors) {
    console.error(`\nValidation failed for ${errors} file(s).`);
    process.exit(1);
  } else {
    console.log('All entries passed schema validation.');
  }
}

main();


