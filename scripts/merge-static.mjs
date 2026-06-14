import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const buildDir = path.join(root, 'build');

const staticFiles = ['index.html', 'styles.css', 'script.js', 'robots.txt', '404.html', 'CNAME'];
const staticDirs = ['assets'];

fs.mkdirSync(buildDir, { recursive: true });

for (const file of staticFiles) {
  const src = path.join(root, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(buildDir, file));
  }
}

for (const dir of staticDirs) {
  const src = path.join(root, dir);
  if (fs.existsSync(src)) {
    fs.cpSync(src, path.join(buildDir, dir), { recursive: true });
  }
}
