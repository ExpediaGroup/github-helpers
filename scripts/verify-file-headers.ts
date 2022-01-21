import getFiles from 'https://deno.land/x/getfiles@v1.0.0/mod.ts';

const filePaths = getFiles({ root: '.', include: ['src', 'test'] }).map(file => file.path);
const filesWithoutCopyrightHeader =
  (await Promise.all(
    filePaths.map(async filePath => {
      const fileText = await Deno.readTextFile(filePath);
      return fileText.startsWith('/*\nCopyright') ? undefined : filePath;
    })
  )).filter(Boolean);

if (filesWithoutCopyrightHeader.length) {
  throw new Error(`\nThe following files are missing a copyright header:\n${filesWithoutCopyrightHeader.join('\n')}`);
}

console.log('All files contain a copyright header!');
