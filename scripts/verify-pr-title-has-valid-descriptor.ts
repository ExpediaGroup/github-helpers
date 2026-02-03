import { Glob } from 'bun';

const title = process.env.TITLE;
if (!title) throw new Error('process.env.TITLE is required');

const glob = new Glob('src/helpers/**/*.ts');
const helpers = Array.from(glob.scanSync('.'))
  .map(file => file.match(/(?<=src\/helpers\/)(.*)(?=\.ts)/)?.find(Boolean));
const validDescriptors = helpers.concat(['repo', 'deps', 'deps-dev']);

const prTitleHasValidDescriptor = title.match(new RegExp(`\((${validDescriptors.join('|')})\)`, 'g'));

if (!prTitleHasValidDescriptor) {
  console.error(`\nPR title is missing a valid descriptor inside parentheses. Must be one of the following:\n${validDescriptors.map(descriptor => `\n   • ${descriptor}`).join('\n')}`);
  process.exit(1);
}

console.info('PR title contains a valid descriptor!');
