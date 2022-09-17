import type { DataFrame } from "./lib/data";

declare module "obsidian" {
	interface App {
		plugins: {
			enabledPlugins: Set<string>;
			plugins: {
				[id: string]: {
					onRegisterProjectView?: () => Builder;
				};
			};
		};
	}
}

declare module "obsidian-projects" {
	interface Link {
		linkText: string;
		sourcePath: string;
	}

	type DataValue =
		| string
		| number
		| boolean
		| Date
		| Link
		| Array<string>
		| undefined;

	interface DataRecord {
		name: string;
		path: string;
		values: Record<string, DataValue>;
	}

	enum DataFieldType {
		String = "string",
		Number = "number",
		Boolean = "boolean",
		Date = "date",
		Link = "link",
		List = "list",
		Unknown = "unknown",
	}

	interface DataField {
		name: string;
		type: DataFieldType;
	}

	interface DataFrame {
		fields: DataField[];
		records: DataRecord[];
	}

	class Builder {
		constructor();
		setTitle(title: string): Builder;
		setNoPadding(): Builder;
		setOnOpen(
			cb: (data: DataFrame, contentEl: HTMLElement) => void
		): Builder;
	}
}
