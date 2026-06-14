import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const postsDir = path.join(root, 'blog', 'src', 'content', 'blog');
const buildDir = path.join(root, 'build');
const site = 'https://coreyduffy.com';

const urls = [`${site}/`, `${site}/blog/`];

if (fs.existsSync(postsDir)) {
  for (const file of fs.readdirSync(postsDir).filter((name) => name.endsWith('.md'))) {
    const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
    if (/draft:\s*true/.test(content)) continue;
    const slug = file.replace(/\.md$/, '');
    urls.push(`${site}/blog/${slug}/`);
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((loc) => `    <url>\n        <loc>${loc}</loc>\n    </url>`).join('\n')}
</urlset>
`;

fs.mkdirSync(buildDir, { recursive: true });
fs.writeFileSync(path.join(buildDir, 'sitemap.xml'), xml);
