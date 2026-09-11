import { existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { detectPackageManager, getInstallCommand, runInstall } from '../utils/package-manager';
import { writeConfig } from '../utils/config';

// Pin Tailwind to v3: the library's components are written against v3 utilities,
// and the generated postcss.config.js below uses `tailwindcss` as a direct
// PostCSS plugin. Tailwind v4 moved that plugin to `@tailwindcss/postcss` and
// would break the consumer's build ("trying to use `tailwindcss` directly as a
// PostCSS plugin").
// `@3` (not `@^3`) on purpose: init spawns the installer with `shell: true`, and
// cmd.exe on Windows eats a literal `^`, which would silently turn `@^3.4.0` into
// `@3.4.0` (an exact pin). `@3` means "latest 3.x" and survives every shell.
const BASE_DEPS = ['tailwindcss@3', 'postcss', 'autoprefixer', 'clsx'];

const TAILWIND_CONFIG = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;

const POSTCSS_CONFIG = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;

export async function init() {
  const cwd = process.cwd();
  const pm = detectPackageManager(cwd);
  
  console.log(`\nDetected package manager: ${pm}`);
  console.log('Installing base dependencies...\n');
  
  const installCmd = getInstallCommand(pm, BASE_DEPS);

  await runInstall(installCmd, cwd);

  console.log('\n✓ Base dependencies installed');
  
  const tailwindPath = join(cwd, 'tailwind.config.js');
  const postcssPath = join(cwd, 'postcss.config.js');
  
  if (!existsSync(tailwindPath)) {
    writeFileSync(tailwindPath, TAILWIND_CONFIG, 'utf-8');
    console.log('✓ Created tailwind.config.js');
  } else {
    console.log('ℹ tailwind.config.js already exists');
    console.log('  Add this to your content array:');
    console.log('  "./src/**/*.{js,ts,jsx,tsx}"');
  }
  
  if (!existsSync(postcssPath)) {
    writeFileSync(postcssPath, POSTCSS_CONFIG, 'utf-8');
    console.log('✓ Created postcss.config.js');
  } else {
    console.log('ℹ postcss.config.js already exists');
  }
  
  writeConfig(cwd, {
    componentsDir: 'src/components/react-essentials',
    hooksDir: 'src/hooks',
    utilsDir: 'src/utils',
  });
  console.log('✓ Created react-essentials.json');
  
  console.log('\n✓ Initialization complete!\n');
}
