import { load } from 'js-yaml';
import { COPYRIGHT_HEADER } from '../src/constants';

const yamlContents = await Bun.file('action.yml').text();
const inputs = (load(yamlContents) as { inputs: { [input: string]: { description: string; required: boolean }} }).inputs

const newContents = `${COPYRIGHT_HEADER}

export class HelperInputs {
${Object.keys(inputs).map(input => `  ${input}?: string;`).join('\n')}
}
`

await Bun.write('src/types/generated.ts', newContents);
