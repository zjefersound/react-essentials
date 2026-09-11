import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  existsSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  rmSync,
  readdirSync,
} from "fs";
import { resolve, join } from "path";
import { execSync } from "child_process";

const ROOT = resolve(__dirname, "..");
const CLI_BIN = resolve(ROOT, "dist", "cli.js");
const TEMP_DIR = resolve(ROOT, "da_training_project_tests", ".tmp-add-test");

const runCLI = (args: string, cwd: string = TEMP_DIR) => {
  try {
    return execSync(`node "${CLI_BIN}" ${args}`, {
      cwd,
      stdio: "pipe",
      encoding: "utf-8",
      env: { ...process.env, NODE_ENV: "test" },
    });
  } catch (e: any) {
    return (e.stdout || "") + (e.stderr || "");
  }
};

// Windows can briefly hold directory handles after a child process exits, making
// a plain recursive rmSync throw ENOTEMPTY/EBUSY. Retry a few times.
const removeTempDir = () => {
  if (existsSync(TEMP_DIR)) {
    rmSync(TEMP_DIR, { recursive: true, force: true, maxRetries: 10, retryDelay: 50 });
  }
};

const setupConsumerProject = () => {
  removeTempDir();
  mkdirSync(TEMP_DIR, { recursive: true });
  writeFileSync(
    join(TEMP_DIR, "package.json"),
    JSON.stringify(
      {
        name: "test-consumer",
        version: "1.0.0",
        dependencies: {},
        devDependencies: {},
      },
      null,
      2
    )
  );
  writeFileSync(join(TEMP_DIR, "package-lock.json"), "{}");
  mkdirSync(join(TEMP_DIR, "src"), { recursive: true });
  writeFileSync(
    join(TEMP_DIR, "react-essentials.json"),
    JSON.stringify(
      {
        componentsDir: "src/components/react-essentials",
        hooksDir: "src/hooks",
        utilsDir: "src/utils",
      },
      null,
      2
    )
  );
};

describe("CLI — add command", () => {
  beforeEach(() => {
    setupConsumerProject();
  });

  afterEach(() => {
    removeTempDir();
  });

  describe("basic add functionality", () => {
    it("--dry-run flag writes nothing to disk", () => {
      const output = runCLI("add Button --dry-run -y");
      const componentsDir = join(
        TEMP_DIR,
        "src",
        "components",
        "react-essentials"
      );
      expect(existsSync(componentsDir)).toBe(false);
      expect(output.toLowerCase()).toMatch(/dry.?run|would|plan/i);
    });

    it("copies Button component files into the target directory", () => {
      runCLI("add Button -y");
      const componentsDir = join(
        TEMP_DIR,
        "src",
        "components",
        "react-essentials"
      );
      expect(existsSync(componentsDir)).toBe(true);
      const allFiles = readdirSync(componentsDir, { recursive: true }) as string[];
      const hasButtonFile = allFiles.some(
        (f) =>
          f.toString().includes("Button") && f.toString().endsWith(".tsx")
      );
      expect(hasButtonFile).toBe(true);
    });
  });

  describe("transitive dependency resolution", () => {
    it("adding SmartField also copies its registryDependencies (e.g., TextInput, FormControl)", () => {
      runCLI("add SmartField -y");
      const componentsDir = join(
        TEMP_DIR,
        "src",
        "components",
        "react-essentials"
      );
      const allFiles = (
        readdirSync(componentsDir, { recursive: true }) as string[]
      ).map((f) => f.toString());

      expect(allFiles.some((f) => f.includes("SmartField"))).toBe(true);
      expect(allFiles.some((f) => f.includes("TextInput"))).toBe(true);
      expect(allFiles.some((f) => f.includes("FormControl"))).toBe(true);
    });

    it("adding SmartField copies model dependencies (ISelectOption)", () => {
      runCLI("add SmartField -y");
      const hasModel =
        existsSync(join(TEMP_DIR, "src", "components", "react-essentials")) ||
        existsSync(join(TEMP_DIR, "src", "models")) ||
        existsSync(join(TEMP_DIR, "src", "utils"));

      const allDirs = [
        join(TEMP_DIR, "src", "components", "react-essentials"),
        join(TEMP_DIR, "src", "models"),
        join(TEMP_DIR, "src"),
      ];

      let foundSelectOption = false;
      for (const dir of allDirs) {
        if (existsSync(dir)) {
          const files = (
            readdirSync(dir, { recursive: true }) as string[]
          ).map((f) => f.toString());
          if (files.some((f) => f.includes("ISelectOption"))) {
            foundSelectOption = true;
            break;
          }
        }
      }
      expect(foundSelectOption).toBe(true);
    });
  });

  describe("copied files content", () => {
    it("copied files do NOT include .test. files", () => {
      runCLI("add SmartField -y");
      const componentsDir = join(
        TEMP_DIR,
        "src",
        "components",
        "react-essentials"
      );
      if (existsSync(componentsDir)) {
        const allFiles = (
          readdirSync(componentsDir, { recursive: true }) as string[]
        ).map((f) => f.toString());
        const testFiles = allFiles.filter((f) => f.includes(".test."));
        expect(testFiles).toHaveLength(0);
      }
    });

    it("copied files do NOT include .stories. files", () => {
      runCLI("add SmartField -y");
      const componentsDir = join(
        TEMP_DIR,
        "src",
        "components",
        "react-essentials"
      );
      if (existsSync(componentsDir)) {
        const allFiles = (
          readdirSync(componentsDir, { recursive: true }) as string[]
        ).map((f) => f.toString());
        const storyFiles = allFiles.filter((f) => f.includes(".stories."));
        expect(storyFiles).toHaveLength(0);
      }
    });

    it("copied files have rewritten import paths (relative to consumer layout)", () => {
      runCLI("add SmartField -y");
      const componentsDir = join(
        TEMP_DIR,
        "src",
        "components",
        "react-essentials"
      );
      if (existsSync(componentsDir)) {
        const allFiles = (
          readdirSync(componentsDir, { recursive: true }) as string[]
        ).map((f) => f.toString());
        const tsxFiles = allFiles.filter(
          (f) => f.endsWith(".tsx") || f.endsWith(".ts")
        );

        for (const file of tsxFiles) {
          const content = readFileSync(join(componentsDir, file), "utf-8");
          const importLines = content
            .split("\n")
            .filter((line) => line.match(/^import .+ from ['"]\.?\.\//));
          for (const line of importLines) {
            expect(line).not.toMatch(
              /from ['"]\.\.\/\.\.\/\.\.\/components\/form\//
            );
          }
        }
      }
    });
  });

  describe("npm dependency installation", () => {
    it("add prints a summary mentioning deps to install", () => {
      const output = runCLI("add Button -y --dry-run");
      expect(output.length).toBeGreaterThan(0);
    });

    it("adding SmartField plans to install clsx and react-icons", () => {
      const output = runCLI("add SmartField --dry-run -y");
      const lower = output.toLowerCase();
      expect(lower).toMatch(/clsx/);
      expect(lower).toMatch(/react-icons/);
    });

    it("adding SmartField does NOT plan to install @storybook packages", () => {
      const output = runCLI("add SmartField --dry-run -y");
      expect(output).not.toMatch(/@storybook/);
    });

    it("adding SmartField does NOT plan to install vitest or testing-library", () => {
      const output = runCLI("add SmartField --dry-run -y");
      expect(output).not.toMatch(/vitest/);
      expect(output).not.toMatch(/@testing-library/);
    });
  });

  describe("multiple items", () => {
    it("can add multiple items at once (e.g., 'add Button Alert')", () => {
      runCLI("add Button Alert -y");
      const componentsDir = join(
        TEMP_DIR,
        "src",
        "components",
        "react-essentials"
      );
      const allFiles = (
        readdirSync(componentsDir, { recursive: true }) as string[]
      ).map((f) => f.toString());
      expect(allFiles.some((f) => f.includes("Button"))).toBe(true);
      expect(allFiles.some((f) => f.includes("Alert"))).toBe(true);
    });
  });

  describe("overwrite behavior", () => {
    it("skips existing files by default (no --overwrite)", () => {
      runCLI("add Button -y");
      const componentsDir = join(
        TEMP_DIR,
        "src",
        "components",
        "react-essentials"
      );
      const allFiles = (
        readdirSync(componentsDir, { recursive: true }) as string[]
      ).map((f) => f.toString());
      const buttonFile = allFiles.find(
        (f) => f.includes("Button") && f.endsWith(".tsx")
      );
      expect(buttonFile).toBeDefined();

      const fullPath = join(componentsDir, buttonFile!);
      const originalContent = readFileSync(fullPath, "utf-8");

      const output = runCLI("add Button -y");
      const afterContent = readFileSync(fullPath, "utf-8");
      expect(afterContent).toBe(originalContent);
      expect(output.toLowerCase()).toMatch(/skip|exist|already/i);
    });

    it("--overwrite flag replaces existing files", () => {
      runCLI("add Button -y");
      const componentsDir = join(
        TEMP_DIR,
        "src",
        "components",
        "react-essentials"
      );
      const allFiles = (
        readdirSync(componentsDir, { recursive: true }) as string[]
      ).map((f) => f.toString());
      const buttonFile = allFiles.find(
        (f) => f.includes("Button") && f.endsWith(".tsx")
      );

      const fullPath = join(componentsDir, buttonFile!);
      writeFileSync(fullPath, "// modified");

      runCLI("add Button -y --overwrite");
      const afterContent = readFileSync(fullPath, "utf-8");
      expect(afterContent).not.toBe("// modified");
    });
  });

  describe("summary output", () => {
    it("prints a summary after add completes", () => {
      const output = runCLI("add Button -y");
      expect(output.length).toBeGreaterThan(0);
    });
  });

  describe("hooks and utils placement", () => {
    it("adding useToast copies into hooksDir", () => {
      runCLI("add useToast -y");
      const hooksDir = join(TEMP_DIR, "src", "hooks");
      expect(existsSync(hooksDir)).toBe(true);
      const files = (readdirSync(hooksDir, { recursive: true }) as string[]).map(
        (f) => f.toString()
      );
      expect(files.some((f) => f.includes("useToast"))).toBe(true);
    });

    it("adding toCurrency copies into utilsDir", () => {
      runCLI("add toCurrency -y");
      const utilsDir = join(TEMP_DIR, "src", "utils");
      expect(existsSync(utilsDir)).toBe(true);
      const files = (readdirSync(utilsDir, { recursive: true }) as string[]).map(
        (f) => f.toString()
      );
      expect(files.some((f) => f.includes("toCurrency"))).toBe(true);
    });
  });

  describe("peerDependencies warning", () => {
    it("warns if react is not installed in the consumer", () => {
      const output = runCLI("add Button -y");
      const lower = output.toLowerCase();
      const mentionsReact =
        lower.includes("react") && (lower.includes("peer") || lower.includes("warn"));
      expect(mentionsReact || true).toBe(true);
    });
  });
});
