import { build } from 'esbuild';
import { mkdir, cp, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });

await build({
  entryPoints: [path.join(projectRoot, 'src/server.ts')],
  outfile: path.join(distDir, 'server.js'),
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node20',
  sourcemap: true,
  minify: true,
  legalComments: 'none',
});

await cp(path.join(projectRoot, 'src/web/views'), path.join(distDir, 'web/views'), {
  recursive: true,
});

await cp(path.join(projectRoot, 'public'), path.join(distDir, 'public'), {
  recursive: true,
});

console.log('Production bundle created in dist/.');
