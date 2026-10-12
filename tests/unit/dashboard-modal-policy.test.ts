import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const dashboardRoot = path.resolve(process.cwd(), "src/components/panel");

function dashboardComponentFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return dashboardComponentFiles(entryPath);
    return entry.isFile() && entry.name.endsWith(".tsx") ? [entryPath] : [];
  });
}

function relative(file: string) {
  return path.relative(process.cwd(), file).replaceAll("\\", "/");
}

describe("dashboard modal success policy", () => {
  const files = dashboardComponentFiles(dashboardRoot);

  it("routes every dashboard dialog through the shared Modal", () => {
    const directDialogViolations = files
      .filter((file) => {
        const source = fs.readFileSync(file, "utf8");
        return /from\s+["'][^"']*ui\/(?:dialog|alert-dialog)["']/.test(source) ||
          /<dialog(?:\s|>)/i.test(source);
      })
      .map(relative);

    expect(directDialogViolations).toEqual([]);
  });

  it("makes every rendered dashboard Modal use the non-optional close-on-success behavior", () => {
    const modalFiles = files.filter((file) =>
      /<Modal(?:\s|>)/.test(fs.readFileSync(file, "utf8")),
    );
    const sharedModalViolations = modalFiles
      .filter((file) => {
        const source = fs.readFileSync(file, "utf8");
        return !/import\s+Modal\s+from\s+["']@\/components\/ui\/modal["']/.test(source) ||
          /closeOnSuccess/.test(source);
      })
      .map(relative);

    expect(modalFiles.length).toBeGreaterThan(50);
    expect(sharedModalViolations).toEqual([]);
  });
});
