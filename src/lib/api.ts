import dayjs from "dayjs";
import produce from "immer";
import {
	parseYaml,
	stringifyYaml,
	TFile,
	type App,
	type FrontMatterCache,
} from "obsidian";
import { get } from "svelte/store";
import { isDate, isLink, type DataRecord } from "./datasource";
import { files } from "./stores/files";

export class RecordApi {
	private app: App;

	constructor(app: App) {
		this.app = app;
	}

	async updateRecord(record: DataRecord): Promise<void> {
		const file = this.app.vault.getAbstractFileByPath(record.path);

		if (file instanceof TFile) {
			const data = await this.app.vault.read(file);

			const frontmatter = this.getFrontMatter(data);

			const updated = Object.fromEntries(
				Object.entries({ ...frontmatter, ...record.values })
					.map((entry) =>
						isDate(entry[1])
							? produce(entry, (draft) => {
									draft[1] = dayjs(entry[1]).format(
										"YYYY-MM-DD"
									);
							  })
							: entry
					)
					.filter((entry) => entry[1] !== undefined)
					.filter((entry) => entry[1] !== null)
			);

			const newdata = this.setFrontMatter(data, updated);

			await this.app.vault.modify(file, newdata);
		}
	}

	deleteRecord(path: string) {
		const file = get(files)[path];

		if (file) {
			this.app.vault.trash(file, true);
		}
	}

	async deleteField(name: string) {
		for (let pair of Object.entries(get(files))) {
			const file = pair[1];

			const data = await this.app.vault.read(file);

			const frontmatter = this.getFrontMatter(data);

			frontmatter[name] = null;

			const updated = Object.fromEntries(
				Object.entries(frontmatter)
					.filter((entry) => entry[1] !== undefined)
					.filter((entry) => entry[1] !== null)
			);

			const newdata = this.setFrontMatter(data, updated);

			await this.app.vault.modify(file, newdata);
		}
	}

	getFrontMatter(data: string): Omit<FrontMatterCache, "position"> {
		const delim = "---";

		var startPosition = data.indexOf(delim) + delim.length;

		const isStart = data.slice(0, startPosition).trim() === delim;

		var endPosition =
			data.slice(startPosition).indexOf(delim) + startPosition;

		const hasFrontMatter = isStart && endPosition > startPosition;

		const { position, ...cache }: FrontMatterCache = hasFrontMatter
			? parseYaml(data.slice(startPosition, endPosition))
			: {};

		return cache;
	}

	setFrontMatter(
		data: string,
		frontmatter: Omit<FrontMatterCache, "position>">
	): string {
		const delim = "---";

		var startPosition = data.indexOf(delim) + delim.length;

		const isStart = data.slice(0, startPosition).trim() === delim;

		var endPosition =
			data.slice(startPosition).indexOf(delim) + startPosition;

		const hasFrontMatter = isStart && endPosition > startPosition;

		if (Object.entries(frontmatter).length) {
			const res = hasFrontMatter
				? data.slice(0, startPosition + 1) +
				  stringifyYaml(frontmatter) +
				  data.slice(endPosition)
				: delim +
				  "\n" +
				  stringifyYaml(frontmatter) +
				  delim +
				  "\n\n" +
				  data;

			return res;
		}

		return hasFrontMatter
			? data.slice(0, startPosition - delim.length) +
					data.slice(endPosition + delim.length + 1)
			: data;
	}
}
