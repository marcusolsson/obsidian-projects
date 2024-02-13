import dayjs from "dayjs";
import { normalizePath, stringifyYaml, type Vault } from "obsidian";
import { v4 as uuidv4 } from "uuid";

import { settings } from "src/lib/stores/settings";
import type { BoardConfig } from "src/ui/views/Board/types";
import type { CalendarConfig } from "src/ui/views/Calendar/types";
import type { GalleryConfig } from "src/ui/views/Gallery/types";
import type { TableConfig } from "src/ui/views/Table/types";
import { DEFAULT_PROJECT, DEFAULT_VIEW } from "src/settings/settings";

export async function createDemoProject(vault: Vault) {
  const demoFolder = "Projects - Demo Project";

  await vault.createFolder(demoFolder);

  const startDate = dayjs();

  const files = {
    "The Best Notes You'll Ever Make": {
      status: "Done",
      due: startDate.subtract(2, "weeks").format("YYYY-MM-DD"),
      published: true,
      weight: 1,
      tags: ["note-taking"],
      image:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
    },
    "The Easiest Way to Start Taking Notes": {
      status: "Done",
      due: startDate.subtract(1, "weeks").format("YYYY-MM-DD"),
      published: true,
      weight: 2,
      tags: ["note-taking", "obsidian"],
      image:
        "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
    },
    "Why You Should Be Taking More Notes": {
      status: "Doing",
      due: startDate.format("YYYY-MM-DD"),
      published: false,
      weight: 3,
      tags: ["note-taking", "pkm"],
      image:
        "https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
    },
    "What I Learned From Taking 15,000 Notes": {
      status: "Backlog",
      due: startDate.add(1, "weeks").format("YYYY-MM-DD"),
      published: false,
      weight: 4,
      tags: ["pkm", "obsidian"],
      image:
        "https://images.unsplash.com/photo-1550592704-6c76defa9985?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
    },
    "5 Mistakes I Made When I Started Using Obsidian": {
      status: "Backlog",
      due: startDate.add(2, "weeks").format("YYYY-MM-DD"),
      published: false,
      tags: ["obsidian"],
      image:
        "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
    },
  };
  for (const [linkText, data] of Object.entries(files)) {
    const content = "---\n" + stringifyYaml(data) + "---\n\n" + "# " + linkText;

    await vault.create(
      normalizePath(demoFolder + "/" + linkText + ".md"),
      content
    );
  }

  const tableConfig: TableConfig = {
    fieldConfig: {
      name: {
        width: 360,
      },
      path: {
        hide: true,
      },
    },
  };

  const boardConfig: BoardConfig = {
    groupByField: "status",
    orderSyncField: "weight",
  };

  const calendarConfig: CalendarConfig = {
    interval: "month",
    dateField: "due",
    checkField: "published",
  };

  const galleryConfig: GalleryConfig = {
    coverField: "image",
  };

  settings.addProject(
    Object.assign({}, DEFAULT_PROJECT, {
      name: "Demo project",
      id: uuidv4(),
      path: demoFolder,
      dataSource: {
        kind: "folder",
        config: {
          path: demoFolder,
          recursive: false,
        },
      },
      views: [
        Object.assign({}, DEFAULT_VIEW, {
          name: "Table",
          id: uuidv4(),
          type: "table",
          config: tableConfig,
        }),
        Object.assign({}, DEFAULT_VIEW, {
          name: "Board",
          id: uuidv4(),
          type: "board",
          config: boardConfig,
        }),
        Object.assign({}, DEFAULT_VIEW, {
          name: "Calendar",
          id: uuidv4(),
          type: "calendar",
          config: calendarConfig,
        }),
        Object.assign({}, DEFAULT_VIEW, {
          name: "Gallery",
          id: uuidv4(),
          type: "gallery",
          config: galleryConfig,
        }),
      ],
    })
  );
}
