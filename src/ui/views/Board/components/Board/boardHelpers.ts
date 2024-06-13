import { app } from "src/lib/stores/obsidian";
import { get } from "svelte/store";

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

export function getTaskProgress(recordId: string): string {
  let progress = "";

  const totalTasks = get(app)
    .metadataCache.getCache(recordId)
    ?.listItems?.filter((item) => item.task !== undefined);

  if (totalTasks?.length) {
    const completedTasks = totalTasks?.filter((item) => item.task !== " ");
    progress = `${completedTasks.length}/${totalTasks.length}`;
  }

  return progress;
}
