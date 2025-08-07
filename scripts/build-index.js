const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const ENTRIES_DIR = path.join(ROOT, 'templates', 'entries');
const OUT_FILE = path.join(ROOT, 'templates', 'index.json');

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
  const list = [];
  for (const file of walkJsonFiles(ENTRIES_DIR)) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    list.push(data);
  }
  list.sort((a, b) => String(a.name).localeCompare(String(b.name)));
  fs.writeFileSync(OUT_FILE, JSON.stringify(list, null, 2) + '\n');
  console.log(`Wrote ${OUT_FILE}`);
}

main();


