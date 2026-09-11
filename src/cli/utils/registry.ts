import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

export interface RegistryItem {
  name: string;
  type: 'component' | 'hook' | 'util' | 'model' | 'context';
  files: string[];
  registryDependencies: string[];
  dependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
}

let cachedRegistry: RegistryItem[] | null = null;

function findPackageRoot(): string {
  let currentDir = dirname(fileURLToPath(import.meta.url));
  
  while (currentDir !== dirname(currentDir)) {
    const pkgPath = join(currentDir, 'package.json');
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
      if (pkg.name === 'react-essentials') {
        return currentDir;
      }
    } catch {
      // Continue searching
    }
    currentDir = dirname(currentDir);
  }
  
  throw new Error('Could not find react-essentials package root');
}

export function getRegistry(): RegistryItem[] {
  if (cachedRegistry) return cachedRegistry;
  
  try {
    const packageRoot = findPackageRoot();
    const registryPath = join(packageRoot, 'registry.json');
    const content = readFileSync(registryPath, 'utf-8');
    cachedRegistry = JSON.parse(content);
    return cachedRegistry!;
  } catch (err) {
    throw new Error(`Failed to load registry: ${err instanceof Error ? err.message : String(err)}`);
  }
}

export function getRegistryItem(name: string): RegistryItem | undefined {
  return getRegistry().find(item => item.name === name);
}

export function resolveTransitiveDependencies(names: string[]): Set<string> {
  const resolved = new Set<string>();
  const queue = [...names];
  
  while (queue.length > 0) {
    const name = queue.shift()!;
    if (resolved.has(name)) continue;
    
    const item = getRegistryItem(name);
    if (!item) continue;
    
    resolved.add(name);
    queue.push(...item.registryDependencies);
  }
  
  return resolved;
}
