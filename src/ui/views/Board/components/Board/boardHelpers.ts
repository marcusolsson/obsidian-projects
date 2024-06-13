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

export async function getTaskProgress(
  recordId: string,
  app: App
): Promise<string> {
  let progress = "";

  const file = app.vault.getFileByPath(recordId);
  if (file) {
    const totalTasks = app.metadataCache
      .getFileCache(file)
      ?.listItems?.filter((item) => item.task !== undefined);

    if (totalTasks) {
      const completedTasks = totalTasks?.filter((item) => item.task !== " ");
      progress = `${completedTasks.length}/${totalTasks.length}`;
    }
  }

  return progress;
}
