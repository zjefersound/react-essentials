import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, statSync } from "fs";
import { resolve, dirname, join } from "path";

const ROOT = resolve(__dirname, "..");
const SRC = resolve(ROOT, "src");

/**
 * Resolves the public barrel graph starting at src/index.ts and concatenates
 * the source of every file it (transitively) re-exports from. src/index.ts is
 * allowed to delegate via `export * from './sub-barrel'`, so a plain text grep
 * of a single file is not enough — we follow the re-exports.
 */
function collectBarrelGraph(entry: string, seen = new Set<string>()): string {
  const resolved = resolveModule(entry);
  if (!resolved || seen.has(resolved)) return "";
  seen.add(resolved);

  let content = readFileSync(resolved, "utf-8");
  const reexportRe = /from\s+['"](\.[^'"]+)['"]/g;
  let match: RegExpExecArray | null;
  while ((match = reexportRe.exec(content)) !== null) {
    const child = resolve(dirname(resolved), match[1]);
    content += "\n" + collectBarrelGraph(child, seen);
  }
  return content;
}

function resolveModule(p: string): string | null {
  const candidates = [
    p,
    `${p}.ts`,
    `${p}.tsx`,
    join(p, "index.ts"),
    join(p, "index.tsx"),
  ];
  return (
    candidates.find((c) => existsSync(c) && statSync(c).isFile()) ?? null
  );
}

describe("Barrel files — src/index.ts", () => {
  it("src/index.ts exists", () => {
    expect(existsSync(resolve(SRC, "index.ts"))).toBe(true);
  });

  let barrelContent: string;

  it("can be read without error", () => {
    barrelContent = collectBarrelGraph(resolve(SRC, "index.ts"));
    expect(barrelContent.length).toBeGreaterThan(0);
  });

  describe("re-exports components", () => {
    it("re-exports TextInput", () => {
      expect(barrelContent).toMatch(/TextInput/);
    });

    it("re-exports Button", () => {
      expect(barrelContent).toMatch(/Button/);
    });

    it("re-exports SmartForm", () => {
      expect(barrelContent).toMatch(/SmartForm/);
    });

    it("re-exports SmartField", () => {
      expect(barrelContent).toMatch(/SmartField/);
    });

    it("re-exports Dialog", () => {
      expect(barrelContent).toMatch(/Dialog/);
    });

    it("re-exports Toast", () => {
      expect(barrelContent).toMatch(/Toast/);
    });

    it("re-exports Avatar", () => {
      expect(barrelContent).toMatch(/Avatar/);
    });

    it("re-exports Select", () => {
      expect(barrelContent).toMatch(/Select/);
    });

    it("re-exports Checkbox", () => {
      expect(barrelContent).toMatch(/Checkbox/);
    });

    it("re-exports FileInput", () => {
      expect(barrelContent).toMatch(/FileInput/);
    });

    it("re-exports Alert", () => {
      expect(barrelContent).toMatch(/Alert/);
    });
  });

  describe("re-exports hooks", () => {
    it("re-exports useToast", () => {
      expect(barrelContent).toMatch(/useToast/);
    });

    it("re-exports useForm", () => {
      expect(barrelContent).toMatch(/useForm/);
    });

    it("re-exports useSmartForm", () => {
      expect(barrelContent).toMatch(/useSmartForm/);
    });
  });

  describe("re-exports utils", () => {
    it("re-exports toCurrency", () => {
      expect(barrelContent).toMatch(/toCurrency/);
    });

    it("re-exports printFileSize", () => {
      expect(barrelContent).toMatch(/printFileSize/);
    });

    it("re-exports getInitials", () => {
      expect(barrelContent).toMatch(/getInitials/);
    });
  });

  describe("re-exports models", () => {
    it("re-exports ISelectOption", () => {
      expect(barrelContent).toMatch(/ISelectOption/);
    });

    it("re-exports SemanticColor", () => {
      expect(barrelContent).toMatch(/SemanticColor|semanticColor/);
    });
  });

  describe("re-exports contexts", () => {
    it("re-exports ToastContext or ToastProvider", () => {
      expect(barrelContent).toMatch(/Toast(Context|Provider)/);
    });
  });
});

describe("Runtime barrel exports — import from the package", () => {
  it("src/index.ts is importable (dynamic import)", async () => {
    const mod = await import(resolve(SRC, "index.ts"));
    expect(mod).toBeDefined();
    expect(typeof mod).toBe("object");
  });

  it("Button is exported and is a component or object", async () => {
    const mod = await import(resolve(SRC, "index.ts"));
    expect(mod.Button).toBeDefined();
  });

  it("toCurrency is exported and is a function", async () => {
    const mod = await import(resolve(SRC, "index.ts"));
    expect(typeof mod.toCurrency).toBe("function");
  });

  it("useToast is exported and is a function", async () => {
    const mod = await import(resolve(SRC, "index.ts"));
    expect(typeof mod.useToast).toBe("function");
  });
});
