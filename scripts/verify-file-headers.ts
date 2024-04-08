/* eslint-disable no-console */
import { sync } from 'glob';
import { filter } from 'bluebird';

const filePaths = sync('{src,test}/**/*.ts');
const filesWithoutCopyrightHeader = await filter(filePaths, async filePath => {
  const fileContents = await Bun.file(filePath).text();
  return !fileContents.startsWith('/*\nCopyright')
});

if (filesWithoutCopyrightHeader.length) {
  console.error(`\nThe following files are missing a valid copyright header:${filesWithoutCopyrightHeader.map(file => `\n   • ${file}`).join()}`);
  process.exit(1);
}

console.info('All files contain a valid copyright header!');
