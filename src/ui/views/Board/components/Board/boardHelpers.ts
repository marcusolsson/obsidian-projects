import type { App } from "obsidian";

export function getDisplayName(recordId: string): string {
  const basename = getBasename(recordId);
  return basename.slice(0, basename.lastIndexOf("."));
}

// This exists in the `path` Node.js package, but reimplementing for mobile support.
function getBasename(str: string) {
  const lastSlash = str.lastIndexOf("/");

  if (lastSlash < 0) {
    return str;
  }

  return str.slice(lastSlash + 1);
}

const CHECKBOX_ITEM_REGEX = /^\s{0,3}-\s{1,4}\[.\]/;
const COMPLETED_ITEM_REGEX = /^\s{0,3}-\s{1,4}\[\S\]/;

// Look for markdown task lists in the record file content and count completion progress
export async function getTaskProgress(recordId: string, app: App): Promise<string> {
  let progress = "";

  const file = app.vault.getFileByPath(recordId);
  if (file) {
    const content = await app.vault.read(file);
    const taskLines = content.split("\n").filter(l => CHECKBOX_ITEM_REGEX.test(l));

    const totalTasks = taskLines.length;
    const completedTasks = taskLines.map(l => COMPLETED_ITEM_REGEX.test(l)).filter(Boolean).length;

    if (totalTasks) {
      progress = `${completedTasks}/${totalTasks}`;
    }
  }
  return progress;
}
