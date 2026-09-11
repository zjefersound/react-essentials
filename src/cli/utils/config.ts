import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

export interface Config {
  componentsDir: string;
  hooksDir: string;
  utilsDir: string;
}

const DEFAULT_CONFIG: Config = {
  componentsDir: 'src/components/react-essentials',
  hooksDir: 'src/hooks',
  utilsDir: 'src/utils',
};

export function getConfig(cwd: string): Config {
  const configPath = join(cwd, 'react-essentials.json');
  
  if (!existsSync(configPath)) {
    return DEFAULT_CONFIG;
  }
  
  try {
    const content = readFileSync(configPath, 'utf-8');
    return { ...DEFAULT_CONFIG, ...JSON.parse(content) };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function writeConfig(cwd: string, config: Config): void {
  const configPath = join(cwd, 'react-essentials.json');
  writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
}
