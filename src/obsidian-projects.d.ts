import type { DataFrame } from "./lib/dataframe/dataframe";

declare module "obsidian" {
  interface Plugin {
    onRegisterProjectView?: () => ProjectView;
  }
  interface App {
    commands: {
      listCommands(): Command[];
      removeCommand(id: string): void;
      findCommand(id: string): Command;
      commands: { [id: string]: Command };
    };
    plugins: {
      getPlugin(name: string): Plugin | null;
      plugins: {
        [id: string]: Plugin;
      };
    };
  }
}
