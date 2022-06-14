import getFiles from 'https://deno.land/x/getfiles@v1.0.0/mod.ts';

const filePaths = getFiles({ root: '.', include: ['src', 'test'] }).filter(file => !file.path.endsWith('.DS_Store')).map(file => file.path);
const filesWithoutCopyrightHeader = filePaths.filter(filePath => !Deno.readTextFileSync(filePath).startsWith('/*\nCopyright'));

if (filesWithoutCopyrightHeader.length) {
  console.error(`\nThe following files are missing a valid copyright header:${filesWithoutCopyrightHeader.map(file => `\n   • ${file}`).join()}`);
  Deno.exit(1);
}

console.info('All files contain a valid copyright header!');
