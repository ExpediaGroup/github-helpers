import { Glob } from 'bun';
import { map } from 'bluebird';

const glob = new Glob('{src,test}/**/*.ts');
const filePaths = Array.from(glob.scanSync('.'));

const fileChecks = await map(
  filePaths, async filePath => {
    const fileContents = await Bun.file(filePath).text();
    const hasCopyright = fileContents.startsWith('/*\nCopyright');
    return { filePath, hasCopyright };
});

const filesWithoutCopyrightHeader = fileChecks
  .filter(({ hasCopyright }) => !hasCopyright)
  .map(({ filePath }) => filePath);

if (filesWithoutCopyrightHeader.length) {
  console.error(`\nThe following files are missing a valid copyright header:${filesWithoutCopyrightHeader.map(file => `\n   • ${file}`).join()}`);
  process.exit(1);
}

console.info('All files contain a valid copyright header!');
