import { app } from "src/lib/stores/obsidian";
import { get } from "svelte/store";

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
