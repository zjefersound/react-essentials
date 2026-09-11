import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { execSync } from "child_process";

const ROOT = resolve(__dirname, "..");
const readJSON = (rel: string) =>
  JSON.parse(readFileSync(resolve(ROOT, rel), "utf-8"));

describe("Deliverable 1 — package.json configuration", () => {
  let pkg: Record<string, any>;

  beforeAll(() => {
    pkg = readJSON("package.json");
  });

  it("does NOT have 'private: true'", () => {
    expect(pkg.private).not.toBe(true);
  });

  it("has a package name", () => {
    expect(typeof pkg.name).toBe("string");
    expect(pkg.name.length).toBeGreaterThan(0);
  });

  it("has a semver version", () => {
    expect(pkg.version).toMatch(/^\d+\.\d+\.\d+/);
  });

  it("has license set to MIT", () => {
    expect(pkg.license).toBe("MIT");
  });

  it("declares 'exports' field", () => {
    expect(pkg.exports).toBeDefined();
  });

  it("declares 'module' field pointing to ESM output", () => {
    expect(typeof pkg.module).toBe("string");
  });

  it("declares 'types' field for TypeScript consumers", () => {
    expect(typeof pkg.types).toBe("string");
  });

  it("files array includes 'dist'", () => {
    expect(pkg.files).toEqual(expect.arrayContaining(["dist"]));
  });

  it("bin field maps 'react-essentials' to dist/cli.js", () => {
    expect(pkg.bin).toBeDefined();
    // npm treats "./dist/cli.js" and "dist/cli.js" identically; accept either.
    expect(pkg.bin["react-essentials"].replace(/^\.\//, "")).toBe("dist/cli.js");
  });

  describe("dependency classification", () => {
    it("react is a peerDependency, NOT a regular dependency", () => {
      expect(pkg.peerDependencies?.react).toBeDefined();
      expect(pkg.dependencies?.react).toBeUndefined();
    });

    it("react-dom is a peerDependency, NOT a regular dependency", () => {
      expect(pkg.peerDependencies?.["react-dom"]).toBeDefined();
      expect(pkg.dependencies?.["react-dom"]).toBeUndefined();
    });

    it("clsx is a regular dependency", () => {
      expect(pkg.dependencies?.clsx).toBeDefined();
    });

    it("react-icons is a regular dependency", () => {
      expect(pkg.dependencies?.["react-icons"]).toBeDefined();
    });

    it("@radix-ui packages are dependencies (not peer)", () => {
      const radixPkgs = Object.keys(pkg.dependencies || {}).filter((k) =>
        k.startsWith("@radix-ui/")
      );
      expect(radixPkgs.length).toBeGreaterThan(0);
    });

    it("does NOT ship storybook packages as dependencies", () => {
      const storybook = Object.keys(pkg.dependencies || {}).filter((k) =>
        k.includes("storybook")
      );
      expect(storybook).toHaveLength(0);
    });

    it("does NOT ship testing packages as dependencies", () => {
      const testing = Object.keys(pkg.dependencies || {}).filter(
        (k) =>
          k.includes("testing-library") ||
          k.includes("vitest") ||
          k.includes("jest")
      );
      expect(testing).toHaveLength(0);
    });
  });
});

describe("Deliverable 1 — dist output", () => {
  it("dist/ directory exists", () => {
    expect(existsSync(resolve(ROOT, "dist"))).toBe(true);
  });

  it("produces ESM output (at least one .js or .mjs file in dist)", () => {
    const { readdirSync } = require("fs");
    const files: string[] = readdirSync(resolve(ROOT, "dist"), {
      recursive: true,
    });
    const esm = files.some(
      (f: string) => f.endsWith(".js") || f.endsWith(".mjs")
    );
    expect(esm).toBe(true);
  });

  it("produces .d.ts type declarations in dist", () => {
    const { readdirSync } = require("fs");
    const files: string[] = readdirSync(resolve(ROOT, "dist"), {
      recursive: true,
    });
    const dts = files.some((f: string) => f.endsWith(".d.ts"));
    expect(dts).toBe(true);
  });

  it("dist does NOT contain story files", () => {
    const { readdirSync } = require("fs");
    const files: string[] = readdirSync(resolve(ROOT, "dist"), {
      recursive: true,
    });
    const stories = files.filter((f: string) => f.includes(".stories."));
    expect(stories).toHaveLength(0);
  });

  it("dist does NOT contain test files", () => {
    const { readdirSync } = require("fs");
    const files: string[] = readdirSync(resolve(ROOT, "dist"), {
      recursive: true,
    });
    const tests = files.filter((f: string) => f.includes(".test."));
    expect(tests).toHaveLength(0);
  });

  it("dist does NOT contain examples/", () => {
    expect(existsSync(resolve(ROOT, "dist", "examples"))).toBe(false);
  });

  it("dist/cli.js exists for the bin entry", () => {
    expect(existsSync(resolve(ROOT, "dist", "cli.js"))).toBe(true);
  });
});

describe("Deliverable 1 — npm pack produces a valid tarball", () => {
  it("npm pack succeeds without error", () => {
    expect(() => {
      execSync("npm pack --dry-run", { cwd: ROOT, stdio: "pipe" });
    }).not.toThrow();
  });
});
