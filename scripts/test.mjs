import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
for (const args of [
  ['build.mjs','--english-only'],
  ['--test', '--test-concurrency=1', 'test/*.test.cjs', 'test/*.test.mjs'],
  ['--test','test/bilingual-preservation.check.mjs'],
]) {
  const env={...process.env,CMS_SKIP_APPROVED:'1'};
  if(args.includes('--test-concurrency=1'))env.SITE_ENGLISH_ONLY='1';
  const result = spawnSync(process.execPath, args, { cwd: root, stdio: 'inherit',env });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
