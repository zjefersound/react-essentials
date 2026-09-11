import { describe, it, expect, beforeAll } from "vitest";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

const ROOT = resolve(__dirname, "..");

interface RegistryItem {
  name: string;
  type: "component" | "hook" | "util" | "model" | "context";
  files: string[];
  registryDependencies: string[];
  dependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
}

describe("Deliverable 2 — scripts/build-registry.ts", () => {
  it("scripts/build-registry.ts exists", () => {
    const tsPath = resolve(ROOT, "scripts", "build-registry.ts");
    expect(existsSync(tsPath)).toBe(true);
  });
});

describe("Deliverable 2 — registry.json structure", () => {
  let registry: RegistryItem[];

  beforeAll(() => {
    const candidates = [
      resolve(ROOT, "registry.json"),
      resolve(ROOT, "dist", "registry.json"),
      resolve(ROOT, "src", "registry.json"),
    ];
    const found = candidates.find((p) => existsSync(p));
    expect(found).toBeDefined();
    registry = JSON.parse(readFileSync(found!, "utf-8"));
  });

  it("is an array", () => {
    expect(Array.isArray(registry)).toBe(true);
  });

  it("contains at least 15 items (components + hooks + utils + models + contexts)", () => {
    expect(registry.length).toBeGreaterThanOrEqual(15);
  });

  it("every item has the required shape", () => {
    for (const item of registry) {
      expect(item).toHaveProperty("name");
      expect(item).toHaveProperty("type");
      expect(item).toHaveProperty("files");
      expect(item).toHaveProperty("registryDependencies");
      expect(item).toHaveProperty("dependencies");
      expect(item).toHaveProperty("peerDependencies");

      expect(typeof item.name).toBe("string");
      expect(["component", "hook", "util", "model", "context"]).toContain(
        item.type
      );
      expect(Array.isArray(item.files)).toBe(true);
      expect(Array.isArray(item.registryDependencies)).toBe(true);
      expect(typeof item.dependencies).toBe("object");
      expect(typeof item.peerDependencies).toBe("object");
    }
  });

  it("names are unique across the registry", () => {
    const names = registry.map((i) => i.name);
    expect(new Set(names).size).toBe(names.length);
  });

  describe("item type classification", () => {
    it("SmartField is type 'component'", () => {
      const item = registry.find((i) => i.name === "SmartField");
      expect(item).toBeDefined();
      expect(item!.type).toBe("component");
    });

    it("useSmartForm is type 'hook'", () => {
      const item = registry.find((i) => i.name === "useSmartForm");
      expect(item).toBeDefined();
      expect(item!.type).toBe("hook");
    });

    it("toCurrency is type 'util'", () => {
      const item = registry.find((i) => i.name === "toCurrency");
      expect(item).toBeDefined();
      expect(item!.type).toBe("util");
    });

    it("ISelectOption is type 'model'", () => {
      const item = registry.find((i) => i.name === "ISelectOption");
      expect(item).toBeDefined();
      expect(item!.type).toBe("model");
    });

    it("Button is type 'component'", () => {
      const item = registry.find((i) => i.name === "Button");
      expect(item).toBeDefined();
      expect(item!.type).toBe("component");
    });

    it("useToast is type 'hook'", () => {
      const item = registry.find((i) => i.name === "useToast");
      expect(item).toBeDefined();
      expect(item!.type).toBe("hook");
    });
  });

  describe("files derivation", () => {
    it("SmartField files include its directory contents", () => {
      const item = registry.find((i) => i.name === "SmartField")!;
      expect(item.files.length).toBeGreaterThanOrEqual(1);
      expect(item.files.some((f) => f.includes("SmartField"))).toBe(true);
    });

    it("files do NOT include *.test.* files", () => {
      for (const item of registry) {
        for (const f of item.files) {
          expect(f).not.toMatch(/\.test\./);
        }
      }
    });

    it("files do NOT include *.stories.* files", () => {
      for (const item of registry) {
        for (const f of item.files) {
          expect(f).not.toMatch(/\.stories\./);
        }
      }
    });
  });

  describe("registryDependencies derivation", () => {
    it("SmartField depends on FormControl", () => {
      const item = registry.find((i) => i.name === "SmartField")!;
      expect(item.registryDependencies).toContain("FormControl");
    });

    it("SmartField depends on TextInput", () => {
      const item = registry.find((i) => i.name === "SmartField")!;
      expect(item.registryDependencies).toContain("TextInput");
    });

    it("SmartField depends on Select", () => {
      const item = registry.find((i) => i.name === "SmartField")!;
      expect(item.registryDependencies).toContain("Select");
    });

    it("SmartField depends on ISelectOption", () => {
      const item = registry.find((i) => i.name === "SmartField")!;
      expect(item.registryDependencies).toContain("ISelectOption");
    });

    it("SmartForm depends on SmartField", () => {
      const item = registry.find((i) => i.name === "SmartForm")!;
      expect(item.registryDependencies).toContain("SmartField");
    });

    it("registryDependencies reference only names that exist in the registry", () => {
      const allNames = new Set(registry.map((i) => i.name));
      for (const item of registry) {
        for (const dep of item.registryDependencies) {
          expect(allNames.has(dep)).toBe(true);
        }
      }
    });
  });

  describe("npm dependency derivation", () => {
    it("Checkbox depends on @radix-ui/react-checkbox", () => {
      const item = registry.find((i) => i.name === "Checkbox")!;
      expect(item.dependencies["@radix-ui/react-checkbox"]).toBeDefined();
    });

    it("Select depends on @radix-ui/react-select", () => {
      const item = registry.find((i) => i.name === "Select")!;
      expect(item.dependencies["@radix-ui/react-select"]).toBeDefined();
    });

    it("dependency versions are pinned from root package.json", () => {
      const rootPkg = JSON.parse(
        readFileSync(resolve(ROOT, "package.json"), "utf-8")
      );
      const allDeps = { ...rootPkg.dependencies, ...rootPkg.devDependencies };
      for (const item of registry) {
        for (const [dep, ver] of Object.entries(item.dependencies)) {
          if (allDeps[dep]) {
            expect(ver).toBe(allDeps[dep]);
          }
        }
      }
    });

    it("react is in peerDependencies, not dependencies", () => {
      for (const item of registry) {
        expect(item.dependencies["react"]).toBeUndefined();
        if (item.peerDependencies["react"]) {
          expect(item.peerDependencies["react"]).toMatch(/>=\s*18|^\^18/);
        }
      }
    });

    it("react-dom is in peerDependencies, not dependencies", () => {
      for (const item of registry) {
        expect(item.dependencies["react-dom"]).toBeUndefined();
      }
    });

    it("no registry item has storybook packages in dependencies", () => {
      for (const item of registry) {
        const storybookDeps = Object.keys(item.dependencies).filter((k) =>
          k.includes("storybook")
        );
        expect(storybookDeps).toHaveLength(0);
      }
    });

    it("no registry item has testing packages in dependencies", () => {
      for (const item of registry) {
        const testDeps = Object.keys(item.dependencies).filter(
          (k) =>
            k.includes("vitest") ||
            k.includes("testing-library") ||
            k.includes("jest")
        );
        expect(testDeps).toHaveLength(0);
      }
    });
  });

  describe("naming conventions", () => {
    it("components use PascalCase names (TextInput, SmartForm, Button, etc.)", () => {
      const components = registry.filter((i) => i.type === "component");
      for (const c of components) {
        expect(c.name).toMatch(/^[A-Z]/);
      }
    });

    it("hooks start with 'use' (useForm, useToast, useSmartForm)", () => {
      const hooks = registry.filter((i) => i.type === "hook");
      for (const h of hooks) {
        expect(h.name).toMatch(/^use[A-Z]/);
      }
    });

    it("utils use camelCase names (toCurrency, printFileSize, getInitials)", () => {
      const utils = registry.filter((i) => i.type === "util");
      for (const u of utils) {
        expect(u.name).toMatch(/^[a-z]/);
      }
    });
  });

  describe("specific expected items exist", () => {
    const expectedItems = [
      "TextInput",
      "SmartField",
      "SmartForm",
      "Button",
      "Dialog",
      "Toast",
      "Avatar",
      "Alert",
      "Heading",
      "Text",
      "Loading",
      "Skeleton",
      "Checkbox",
      "RadioGroup",
      "Select",
      "Slider",
      "FileInput",
      "Textarea",
      "FormControl",
      "useForm",
      "useSmartForm",
      "useToast",
      "toCurrency",
      "printFileSize",
      "getInitials",
      "ISelectOption",
    ];

    for (const name of expectedItems) {
      it(`registry contains '${name}'`, () => {
        expect(registry.find((i) => i.name === name)).toBeDefined();
      });
    }
  });
});
