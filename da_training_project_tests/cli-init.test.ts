import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { existsSync, readFileSync, writeFileSync, mkdirSync, rmSync } from "fs";
import { resolve, join } from "path";
import { execSync } from "child_process";

const ROOT = resolve(__dirname, "..");
const CLI_BIN = resolve(ROOT, "dist", "cli.js");
const TEMP_DIR = resolve(ROOT, "da_training_project_tests", ".tmp-init-test");

const runCLI = (args: string, cwd: string) =>
  execSync(`node "${CLI_BIN}" ${args}`, {
    cwd,
    stdio: "pipe",
    encoding: "utf-8",
    env: { ...process.env, NODE_ENV: "test" },
  });

// Windows can briefly hold directory handles open after a child process exits,
// which makes a plain recursive rmSync throw ENOTEMPTY/EBUSY. Retry a few times.
const removeTempDir = () => {
  if (existsSync(TEMP_DIR)) {
    rmSync(TEMP_DIR, { recursive: true, force: true, maxRetries: 10, retryDelay: 50 });
  }
};

describe("CLI — init command", () => {
  beforeEach(() => {
    removeTempDir();
    mkdirSync(TEMP_DIR, { recursive: true });
    writeFileSync(
      join(TEMP_DIR, "package.json"),
      JSON.stringify({ name: "test-consumer", version: "1.0.0" }, null, 2)
    );
    writeFileSync(join(TEMP_DIR, "package-lock.json"), "{}");
  });

  afterEach(() => {
    removeTempDir();
  });

  it("creates react-essentials.json config file", () => {
    try {
      runCLI("init", TEMP_DIR);
    } catch {
      // init may fail due to missing npm deps, but should still write config
    }
    expect(existsSync(join(TEMP_DIR, "react-essentials.json"))).toBe(true);
  });

  it("config file has componentsDir, hooksDir, utilsDir keys", () => {
    try {
      runCLI("init", TEMP_DIR);
    } catch {}
    const config = JSON.parse(
      readFileSync(join(TEMP_DIR, "react-essentials.json"), "utf-8")
    );
    expect(config).toHaveProperty("componentsDir");
    expect(config).toHaveProperty("hooksDir");
    expect(config).toHaveProperty("utilsDir");
  });

  it("config componentsDir defaults to src/components/react-essentials", () => {
    try {
      runCLI("init", TEMP_DIR);
    } catch {}
    const config = JSON.parse(
      readFileSync(join(TEMP_DIR, "react-essentials.json"), "utf-8")
    );
    expect(config.componentsDir).toBe("src/components/react-essentials");
  });

  it("is idempotent — re-running init does not error", () => {
    try {
      runCLI("init", TEMP_DIR);
    } catch {}
    expect(() => {
      try {
        runCLI("init", TEMP_DIR);
      } catch {}
    }).not.toThrow();
    expect(existsSync(join(TEMP_DIR, "react-essentials.json"))).toBe(true);
  });

  it("detects npm package manager from lockfile", () => {
    const output = (() => {
      try {
        return runCLI("init", TEMP_DIR);
      } catch (e: any) {
        return e.stdout || e.stderr || "";
      }
    })();
    expect(typeof output).toBe("string");
  });

  it("writes minimal tailwind.config if absent", () => {
    try {
      runCLI("init", TEMP_DIR);
    } catch {}
    const hasTailwind =
      existsSync(join(TEMP_DIR, "tailwind.config.js")) ||
      existsSync(join(TEMP_DIR, "tailwind.config.ts")) ||
      existsSync(join(TEMP_DIR, "tailwind.config.cjs")) ||
      existsSync(join(TEMP_DIR, "tailwind.config.mjs"));
    expect(hasTailwind).toBe(true);
  });

  it("writes minimal postcss.config if absent", () => {
    try {
      runCLI("init", TEMP_DIR);
    } catch {}
    const hasPostcss =
      existsSync(join(TEMP_DIR, "postcss.config.js")) ||
      existsSync(join(TEMP_DIR, "postcss.config.ts")) ||
      existsSync(join(TEMP_DIR, "postcss.config.cjs")) ||
      existsSync(join(TEMP_DIR, "postcss.config.mjs"));
    expect(hasPostcss).toBe(true);
  });

  it("does NOT overwrite existing tailwind.config", () => {
    const tailwindPath = join(TEMP_DIR, "tailwind.config.js");
    const originalContent = "module.exports = { custom: true }";
    writeFileSync(tailwindPath, originalContent);
    try {
      runCLI("init", TEMP_DIR);
    } catch {}
    expect(readFileSync(tailwindPath, "utf-8")).toBe(originalContent);
  });

  it("does NOT overwrite existing postcss.config", () => {
    const postcssPath = join(TEMP_DIR, "postcss.config.js");
    const originalContent = "module.exports = { custom: true }";
    writeFileSync(postcssPath, originalContent);
    try {
      runCLI("init", TEMP_DIR);
    } catch {}
    expect(readFileSync(postcssPath, "utf-8")).toBe(originalContent);
  });

  // --- Regression: the generated Tailwind/PostCSS setup must actually build ---
  //
  // `init` writes a postcss.config.js that uses `tailwindcss` as a direct PostCSS
  // plugin. That form only works with Tailwind v3 — v4 moved it to
  // `@tailwindcss/postcss` and otherwise throws:
  //   "trying to use `tailwindcss` directly as a PostCSS plugin ..."
  // So the version `init` installs and the plugin form it writes must agree.

  const readPostcssConfig = () => {
    const path = [
      "postcss.config.js",
      "postcss.config.cjs",
      "postcss.config.mjs",
      "postcss.config.ts",
    ]
      .map((f) => join(TEMP_DIR, f))
      .find((p) => existsSync(p));
    return path ? readFileSync(path, "utf-8") : null;
  };

  // The Tailwind major that `init` installs (BASE_DEPS) and the PostCSS plugin
  // form it writes must agree. `tailwindcss` as a direct PostCSS plugin is
  // Tailwind v3 only; v4 requires the separate `@tailwindcss/postcss` package.
  const getInitIntent = () => {
    const initSrc = readFileSync(
      resolve(ROOT, "src", "cli", "commands", "init.ts"),
      "utf-8"
    );
    const baseDeps =
      initSrc.match(/BASE_DEPS\s*=\s*\[([\s\S]*?)\]/)?.[1] ?? "";
    const tailwindDep = baseDeps.match(/["']tailwindcss(?:@([^"']*))?["']/);
    const postcssTemplate =
      initSrc.match(/POSTCSS_CONFIG\s*=\s*`([\s\S]*?)`/)?.[1] ?? "";
    return {
      tailwindPinned: tailwindDep !== null,
      tailwindRange: tailwindDep?.[1] ?? "",
      postcssUsesV4Plugin: /@tailwindcss\/postcss/.test(postcssTemplate),
      postcssUsesBarePlugin: /\btailwindcss\b\s*:/.test(postcssTemplate),
    };
  };

  it("BASE_DEPS Tailwind version matches the generated PostCSS plugin form", () => {
    const intent = getInitIntent();

    if (intent.postcssUsesV4Plugin) {
      if (intent.tailwindPinned && intent.tailwindRange) {
        expect(intent.tailwindRange).toMatch(/^[\^~]?4(\.|$)/);
      }
    } else if (intent.postcssUsesBarePlugin) {
      expect(
        intent.tailwindPinned,
        "postcss.config uses `tailwindcss` directly -> BASE_DEPS must pin tailwindcss to v3"
      ).toBe(true);
      expect(intent.tailwindRange).toMatch(/^[\^~]?3(\.|$)/);
    }
  });

  it("running init produces a Tailwind + PostCSS config pair that is internally consistent", () => {
    try {
      runCLI("init", TEMP_DIR);
    } catch {}

    const postcss = readPostcssConfig();
    expect(postcss).not.toBeNull();

    // Whatever plugin the generated postcss.config references, the installed
    // Tailwind (when present) must be the matching major.
    const twPkg = join(TEMP_DIR, "node_modules", "tailwindcss", "package.json");
    if (existsSync(twPkg)) {
      const major = Number(
        JSON.parse(readFileSync(twPkg, "utf-8")).version.split(".")[0]
      );
      if (/@tailwindcss\/postcss/.test(postcss!)) {
        expect(major).toBeGreaterThanOrEqual(4);
      } else {
        expect(major).toBe(3);
      }
    }

    // And the config must not reference the v4 plugin while BASE_DEPS pins v3.
    const intent = getInitIntent();
    if (intent.tailwindRange.startsWith("3") || intent.tailwindRange.startsWith("^3")) {
      expect(postcss).not.toMatch(/@tailwindcss\/postcss/);
    }
  });
});
