import { parse } from 'https://deno.land/std@0.82.0/encoding/yaml.ts';
import { COPYRIGHT_HEADER } from '../src/constants.ts';

const yamlContents = Deno.readTextFileSync('action.yml');
const inputs = (parse(yamlContents) as { inputs: { [input: string]: { description: string; required: boolean }} }).inputs

const newContents = `${COPYRIGHT_HEADER}

export class HelperInputs {
${Object.keys(inputs).map(input => `  ${input}?: string;`).join('\n')}
}
`

Deno.writeTextFileSync('src/types/generated.ts', newContents);
