import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative, extname, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const srcDir = join(rootDir, 'src');

interface RegistryItem {
  name: string;
  type: 'component' | 'hook' | 'util' | 'model' | 'context';
  files: string[];
  registryDependencies: string[];
  dependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
}

const packageJson = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf-8'));

const PEER_DEPS = ['react', 'react-dom'];
const TEST_STORY_PATTERNS = ['.test.', '.stories.', '.spec.'];
const INTERNAL_PREFIXES = ['..', '.'];

function isTestOrStoryFile(filePath: string): boolean {
  return TEST_STORY_PATTERNS.some(pattern => filePath.includes(pattern));
}

function getAllFiles(dir: string, fileList: string[] = []): string[] {
  const files = readdirSync(dir);
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (
      (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) &&
      !isTestOrStoryFile(filePath)
    ) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function extractImports(fileContent: string): string[] {
  const importRegex = /import\s+(?:(?:[\w*\s{},]*)\s+from\s+)?['"]([^'"]+)['"]/g;
  const imports: string[] = [];
  let match;
  
  while ((match = importRegex.exec(fileContent)) !== null) {
    imports.push(match[1]);
  }
  
  return imports;
}

function resolveImportToRegistryName(importPath: string, fromFile: string): string | null {
  if (!INTERNAL_PREFIXES.some(prefix => importPath.startsWith(prefix))) {
    return null;
  }

  const fromDir = dirname(fromFile);
  const resolvedPath = join(fromDir, importPath);
  const relativePath = relative(srcDir, resolvedPath).replace(/\\/g, '/');

  const parts = relativePath.split('/');

  if (parts[0] === 'components') {
    // A `hooks/` directory nested inside a component (e.g. SmartForm/hooks/useForm)
    // is published as its own standalone hook item, keyed by the file name.
    const hooksIdx = parts.indexOf('hooks');
    if (hooksIdx >= 3) {
      return basename(resolvedPath).replace(/\.(ts|tsx)$/, '');
    }

    if (parts[1] === 'form' || parts[1] === 'ui') {
      const componentName = parts[2];
      if (componentName === 'SmartField' || componentName === 'SmartForm') {
        return componentName;
      }
      const fileName = basename(resolvedPath);
      if (fileName.match(/^[A-Z]/)) {
        return fileName.replace(/\.(ts|tsx)$/, '');
      }
      return componentName;
    }
  } else if (parts[0] === 'hooks') {
    const fileName = basename(resolvedPath);
    return fileName.replace(/\.(ts|tsx)$/, '');
  } else if (parts[0] === 'utils') {
    const fileName = basename(resolvedPath);
    return fileName.replace(/\.(ts|tsx)$/, '');
  } else if (parts[0] === 'models') {
    const fileName = basename(resolvedPath);
    return fileName.replace(/\.(ts|tsx)$/, '');
  } else if (parts[0] === 'contexts') {
    const fileName = basename(resolvedPath);
    return fileName.replace(/\.(ts|tsx)$/, '');
  }
  
  return null;
}

function getItemType(relativePath: string): RegistryItem['type'] | null {
  if (relativePath.startsWith('components/')) {
    // Hooks living in a nested `hooks/` folder are published as hooks, not components.
    if (relativePath.split('/').indexOf('hooks') >= 3) return 'hook';
    return 'component';
  }
  if (relativePath.startsWith('hooks/')) return 'hook';
  if (relativePath.startsWith('utils/')) return 'util';
  if (relativePath.startsWith('models/')) return 'model';
  if (relativePath.startsWith('contexts/')) return 'context';
  return null;
}

function getItemName(relativePath: string): string | null {
  const parts = relativePath.split('/');
  
  if (parts[0] === 'components') {
    if (parts[1] === 'form' || parts[1] === 'ui') {
      // Nested `hooks/` folder -> standalone hook item, keyed by file name.
      const hooksIdx = parts.indexOf('hooks');
      if (hooksIdx >= 3) {
        const fileName = parts[parts.length - 1];
        return basename(fileName, extname(fileName));
      }
      // Barrel file sitting directly in components/form|ui -> not a publishable item.
      if (parts.length === 3 && /^index\.(ts|tsx)$/.test(parts[2])) {
        return null;
      }
      if (parts[2] === 'atoms') {
        return basename(parts[3], extname(parts[3]));
      }
      const componentPart = parts[2];
      return basename(componentPart, extname(componentPart));
    }
  } else if (['hooks', 'utils', 'models', 'contexts'].includes(parts[0])) {
    const name = basename(parts[1], extname(parts[1]));
    // A top-level `index.ts` here is a barrel/re-export, not a publishable item.
    if (name === 'index') return null;
    return name;
  }

  return null;
}

function groupFilesByItem(files: string[]): Map<string, string[]> {
  const items = new Map<string, string[]>();
  
  files.forEach(file => {
    const relativePath = relative(srcDir, file).replace(/\\/g, '/');
    const itemName = getItemName(relativePath);
    
    if (itemName) {
      if (!items.has(itemName)) {
        items.set(itemName, []);
      }
      items.get(itemName)!.push(relativePath);
    }
  });
  
  return items;
}

function buildRegistry(): RegistryItem[] {
  const allFiles = getAllFiles(srcDir);
  const itemFiles = groupFilesByItem(allFiles);
  const registry: RegistryItem[] = [];
  
  itemFiles.forEach((files, name) => {
    const firstFile = files[0];
    const type = getItemType(firstFile);
    
    if (!type) return;
    
    const registryDeps = new Set<string>();
    const npmDeps = new Map<string, string>();
    const peerDeps = new Map<string, string>();
    
    files.forEach(file => {
      const fullPath = join(srcDir, file);
      const content = readFileSync(fullPath, 'utf-8');
      const imports = extractImports(content);
      
      imports.forEach(imp => {
        if (INTERNAL_PREFIXES.some(prefix => imp.startsWith(prefix))) {
          const depName = resolveImportToRegistryName(imp, fullPath);
          if (depName && depName !== name) {
            registryDeps.add(depName);
          }
        } else {
          if (PEER_DEPS.includes(imp)) {
            const version = packageJson.dependencies[imp] || packageJson.peerDependencies?.[imp];
            if (version) {
              peerDeps.set(imp, version);
            }
          } else {
            const version = packageJson.dependencies[imp];
            if (version) {
              npmDeps.set(imp, version);
            }
          }
        }
      });
    });
    
    registry.push({
      name,
      type,
      files,
      registryDependencies: Array.from(registryDeps).sort(),
      dependencies: Object.fromEntries(npmDeps),
      peerDependencies: Object.fromEntries(peerDeps),
    });
  });
  
  return registry.sort((a, b) => a.name.localeCompare(b.name));
}

function main() {
  console.log('Building registry...');
  const registry = buildRegistry();
  const outputPath = join(rootDir, 'registry.json');
  
  writeFileSync(outputPath, JSON.stringify(registry, null, 2), 'utf-8');
  console.log(`Registry built successfully: ${registry.length} items`);
  console.log(`Output: ${outputPath}`);
}

main();
