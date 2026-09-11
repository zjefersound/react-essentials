import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import prompts from 'prompts';
import { getConfig } from '../utils/config';
import { getRegistryItem, resolveTransitiveDependencies } from '../utils/registry';
import { detectPackageManager, getInstallCommand, runInstall } from '../utils/package-manager';

interface AddOptions {
  yes?: boolean;
  overwrite?: boolean;
  cwd?: string;
  dryRun?: boolean;
}

function getTargetDir(type: string, config: ReturnType<typeof getConfig>): string {
  if (type === 'component') return config.componentsDir;
  if (type === 'hook') return config.hooksDir;
  if (type === 'util' || type === 'model' || type === 'context') return config.utilsDir;
  return config.componentsDir;
}

function rewriteImports(content: string, oldPath: string, newPath: string, allItems: Map<string, string>): string {
  const importRegex = /from\s+['"](\.[^'"]+)['"]/g;
  
  return content.replace(importRegex, (match, importPath) => {
    const resolvedOld = join(dirname(oldPath), importPath);
    const normalizedOld = resolvedOld.replace(/\\/g, '/');
    
    const targetPath = allItems.get(normalizedOld);
    if (targetPath) {
      const relativePath = relative(dirname(newPath), targetPath).replace(/\\/g, '/');
      const finalPath = relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
      return `from '${finalPath}'`;
    }
    
    return match;
  });
}

export async function add(components: string[], options: AddOptions) {
  const cwd = options.cwd || process.cwd();
  const config = getConfig(cwd);
  
  const missingComponents = components.filter(name => !getRegistryItem(name));
  if (missingComponents.length > 0) {
    console.error(`\nError: Components not found: ${missingComponents.join(', ')}`);
    console.log('Run "react-essentials list" to see available components.\n');
    process.exit(1);
  }
  
  const allNames = resolveTransitiveDependencies(components);
  const items = Array.from(allNames).map(name => getRegistryItem(name)!);
  
  if (!options.yes && !options.dryRun) {
    const { confirmed } = await prompts({
      type: 'confirm',
      name: 'confirmed',
      message: `Install ${items.length} item(s) (${Array.from(allNames).join(', ')})?`,
      initial: true,
    });
    
    if (!confirmed) {
      console.log('Cancelled.');
      return;
    }
  }
  
  const filesToWrite: Array<{ src: string; dest: string; content: string }> = [];
  const fileMap = new Map<string, string>();
  
  for (const item of items) {
    const targetDir = getTargetDir(item.type, config);
    
    for (const file of item.files) {
      let relativePath = file;
      if (file.startsWith('components/form/') || file.startsWith('components/ui/')) {
        relativePath = file.replace(/^components\/(form|ui)\//, '');
      } else if (file.startsWith('hooks/')) {
        relativePath = file.replace(/^hooks\//, '');
      } else if (file.startsWith('utils/') || file.startsWith('models/') || file.startsWith('contexts/')) {
        relativePath = file.replace(/^(utils|models|contexts)\//, '');
      }
      
      const destPath = join(cwd, targetDir, relativePath);
      
      fileMap.set(file.replace(/\\/g, '/'), destPath);
      
      if (existsSync(destPath) && !options.overwrite) {
        console.log(`⊘ Skipped (exists): ${relative(cwd, destPath)}`);
        continue;
      }
      
      let content: string;
      const currentDir = dirname(fileURLToPath(import.meta.url));
      let packageRoot = currentDir;
      
      while (packageRoot !== dirname(packageRoot)) {
        const pkgPath = join(packageRoot, 'package.json');
        try {
          const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
          if (pkg.name === 'react-essentials') {
            break;
          }
        } catch {
          // Continue searching
        }
        packageRoot = dirname(packageRoot);
      }
      
      const sourcePath = join(packageRoot, 'src', file);
      
      try {
        content = readFileSync(sourcePath, 'utf-8');
      } catch (err) {
        console.error(`Failed to read source file: ${file}`);
        console.error(`Tried path: ${sourcePath}`);
        console.error(`Package root: ${packageRoot}`);
        throw err;
      }
      
      filesToWrite.push({ src: file, dest: destPath, content });
    }
  }
  
  for (const file of filesToWrite) {
    const rewritten = rewriteImports(file.content, file.src, file.dest, fileMap);
    
    if (options.dryRun) {
      console.log(`[DRY RUN] Would write: ${relative(cwd, file.dest)}`);
    } else {
      mkdirSync(dirname(file.dest), { recursive: true });
      writeFileSync(file.dest, rewritten, 'utf-8');
      console.log(`✓ Created: ${relative(cwd, file.dest)}`);
    }
  }
  
  const allDeps = new Map<string, string>();
  items.forEach(item => {
    Object.entries(item.dependencies).forEach(([pkg, version]) => {
      allDeps.set(pkg, version);
    });
  });
  
  const missingPeerDeps: string[] = [];
  items.forEach(item => {
    Object.keys(item.peerDependencies).forEach(pkg => {
      try {
        require.resolve(pkg, { paths: [cwd] });
      } catch {
        if (!missingPeerDeps.includes(pkg)) {
          missingPeerDeps.push(pkg);
        }
      }
    });
  });
  
  if (missingPeerDeps.length > 0) {
    console.log(`\n⚠ Warning: Missing peer dependencies: ${missingPeerDeps.join(', ')}`);
    console.log('Please install them manually.\n');
  }
  
  if (allDeps.size > 0 && !options.dryRun) {
    const pm = detectPackageManager(cwd);
    const packages = Array.from(allDeps.entries()).map(([pkg, version]) => `${pkg}@${version}`);
    
    console.log(`\nInstalling ${packages.length} dependencies with ${pm}...`);
    
    const installCmd = getInstallCommand(pm, packages);
    await runInstall(installCmd, cwd);

    console.log('✓ Dependencies installed');
  } else if (options.dryRun) {
    console.log(`\n[DRY RUN] Would install: ${Array.from(allDeps.keys()).join(', ')}`);
  }
  
  console.log(`\n✓ Added ${items.length} item(s) successfully!\n`);
}
