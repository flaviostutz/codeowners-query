import * as fs from 'node:fs';
import path from 'node:path';

import { Command } from 'commander';

import { parseCodeowners } from '../../app/parse-codeowners';
import { owners } from '../../app/owners';

const program = new Command();

program
  .name('codeowners-query')
  .description('Query owners for file paths based on a CODEOWNERS file')
  .version(PKG_VERSION)
  .option('-v, --verbose', 'enable verbose output');

program
  .command('owners <files>')
  .description('list owners for the given comma-separated file paths')
  .option(
    '--codeowners-file <path>',
    'path to CODEOWNERS file',
    path.join(process.cwd(), 'CODEOWNERS'),
  )
  .option('-v, --verbose', 'enable verbose output')
  .action((files: string, options: { codeownersFile: string; verbose?: boolean }) => {
    const codeownersPath = path.resolve(options.codeownersFile);

    if (options.verbose) {
      process.stderr.write(`Reading CODEOWNERS from: ${codeownersPath}\n`);
    }

    let text: string;
    try {
      text = fs.readFileSync(codeownersPath, 'utf8');
    } catch {
      process.stderr.write(`Error: CODEOWNERS file not found at ${codeownersPath}\n`);
      throw new Error(`CODEOWNERS file not found at ${codeownersPath}`);
    }

    const rules = parseCodeowners(text);

    if (options.verbose) {
      process.stderr.write(`Parsed ${rules.length} rules from CODEOWNERS\n`);
    }

    const filePaths = files
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    if (options.verbose) {
      process.stderr.write(`Querying owners for: ${filePaths.join(', ')}\n`);
    }

    const result = owners(filePaths, rules);

    if (result.length === 0) {
      process.stdout.write('\n');
    } else {
      process.stdout.write(`${result.join('\n')}\n`);
    }
  });

program.parse();
