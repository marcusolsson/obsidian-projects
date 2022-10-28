import dayjs from "dayjs";
import { normalizePath, stringifyYaml, type Vault } from "obsidian";
import { settings } from "src/lib/stores/settings";
import type { BoardConfig } from "src/views/Board/types";
import type { CalendarConfig } from "src/views/Calendar/types";
import type { GalleryConfig } from "src/views/Gallery/types";
import type { GridConfig } from "src/views/Table/types";
import { v4 as uuidv4 } from "uuid";

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
			image: "https://source.unsplash.com/random",
		},
		"The Easiest Way to Start Taking Notes": {
			status: "Done",
			due: startDate.subtract(1, "weeks").format("YYYY-MM-DD"),
			published: true,
			weight: 2,
			tags: ["note-taking", "obsidian"],
			image: "https://source.unsplash.com/random",
		},
		"Why You Should Be Taking More Notes": {
			status: "Doing",
			due: startDate.format("YYYY-MM-DD"),
			published: false,
			weight: 3,
			tags: ["note-taking", "pkm"],
			image: "https://source.unsplash.com/random",
		},
		"What I Learned From Taking 15,000 Notes": {
			status: "Backlog",
			due: startDate.add(1, "weeks").format("YYYY-MM-DD"),
			published: false,
			weight: 4,
			tags: ["pkm", "obsidian"],
			image: "https://source.unsplash.com/random",
		},
		"5 Mistake I Made When I Started Using Obsidian": {
			status: "Backlog",
			due: startDate.add(2, "weeks").format("YYYY-MM-DD"),
			published: false,
			tags: ["obsidian"],
			image: "https://source.unsplash.com/random",
		},
	};
	for (let [linkText, data] of Object.entries(files)) {
		const content =
			"---\n" + stringifyYaml(data) + "---\n\n" + "# " + linkText;

		await vault.create(
			normalizePath(demoFolder + "/" + linkText + ".md"),
			content
		);
	}

	const tableConfig: GridConfig = {
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
		priorityField: "weight",
	};

	const calendarConfig: CalendarConfig = {
		interval: "month",
		dateField: "due",
		checkField: "published",
	};

	const galleryConfig: GalleryConfig = {
		coverField: "image",
	};

	settings.addProject({
		name: "Demo project",
		id: uuidv4(),
		path: demoFolder,
		recursive: false,
		views: [
			{ name: "Table", id: uuidv4(), type: "table", config: tableConfig },
			{ name: "Board", id: uuidv4(), type: "board", config: boardConfig },
			{
				name: "Calendar",
				id: uuidv4(),
				type: "calendar",
				config: calendarConfig,
			},
			{
				name: "Gallery",
				id: uuidv4(),
				type: "gallery",
				config: galleryConfig,
			},
		],
	});
}
