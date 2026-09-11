import { describe, it, expect } from "vitest";
import { resolve } from "path";
import { execSync } from "child_process";

const ROOT = resolve(__dirname, "..");
const CLI_BIN = resolve(ROOT, "dist", "cli.js");

const runCLI = (args: string) =>
  execSync(`node "${CLI_BIN}" ${args}`, {
    cwd: ROOT,
    stdio: "pipe",
    encoding: "utf-8",
  });

describe("CLI — list command", () => {
  it("outputs registry items", () => {
    const output = runCLI("list");
    expect(output.length).toBeGreaterThan(0);
  });

  it("lists SmartField", () => {
    const output = runCLI("list");
    expect(output).toContain("SmartField");
  });

  it("lists useSmartForm", () => {
    const output = runCLI("list");
    expect(output).toContain("useSmartForm");
  });

  it("lists toCurrency", () => {
    const output = runCLI("list");
    expect(output).toContain("toCurrency");
  });

  it("lists Button", () => {
    const output = runCLI("list");
    expect(output).toContain("Button");
  });

  it("output is grouped by type", () => {
    const output = runCLI("list");
    const lower = output.toLowerCase();
    expect(lower).toMatch(/component/);
    expect(lower).toMatch(/hook/);
    expect(lower).toMatch(/util/);
  });

  it("--json flag outputs valid JSON", () => {
    const output = runCLI("list --json");
    expect(() => JSON.parse(output)).not.toThrow();
  });

  it("--json output is an array of registry items", () => {
    const output = runCLI("list --json");
    const parsed = JSON.parse(output);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.length).toBeGreaterThan(0);
    expect(parsed[0]).toHaveProperty("name");
    expect(parsed[0]).toHaveProperty("type");
  });
});

describe("CLI — help", () => {
  it("-h flag prints help text", () => {
    const output = runCLI("-h");
    expect(output).toContain("init");
    expect(output).toContain("list");
    expect(output).toContain("add");
  });

  it("--help flag prints help text", () => {
    const output = runCLI("--help");
    expect(output.length).toBeGreaterThan(0);
  });
});
