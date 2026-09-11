import { getRegistry } from '../utils/registry';

interface ListOptions {
  json?: boolean;
}

export function list(options: ListOptions) {
  const registry = getRegistry();
  
  if (options.json) {
    console.log(JSON.stringify(registry, null, 2));
    return;
  }
  
  const grouped = registry.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item.name);
    return acc;
  }, {} as Record<string, string[]>);
  
  console.log('\nAvailable components, hooks, and utilities:\n');
  
  Object.entries(grouped).forEach(([type, items]) => {
    console.log(`${type.toUpperCase()}S:`);
    items.forEach(name => console.log(`  - ${name}`));
    console.log('');
  });
}
