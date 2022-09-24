import type { DataFrame } from "./lib/types";

declare module "obsidian" {
	interface App {
		plugins: {
			enabledPlugins: Set<string>;
			plugins: {
				[id: string]: {
					onRegisterProjectView?: (builder: Builder) => void;
					onRegisterProjectViewV2?: () => ProjectViewV2;
				};
			};
		};
	}
}
