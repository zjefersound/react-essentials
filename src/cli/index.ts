#!/usr/bin/env node

import { Command } from 'commander';
import { init } from './commands/init';
import { list } from './commands/list';
import { add } from './commands/add';

const program = new Command();

program
  .name('react-essentials')
  .description('CLI to install React components from react-essentials library')
  .version('0.1.0');

program
  .command('init')
  .description('Install base dependencies and create config file')
  .action(init);

program
  .command('list')
  .description('List all available components, hooks, and utilities')
  .option('--json', 'Output as JSON')
  .action(list);

program
  .command('add <components...>')
  .description('Add component(s) to your project')
  .option('-y, --yes', 'Skip confirmation prompt')
  .option('-o, --overwrite', 'Overwrite existing files')
  .option('-c, --cwd <dir>', 'Working directory', process.cwd())
  .option('--dry-run', 'Preview changes without writing files')
  .action(add);

program.parse();
