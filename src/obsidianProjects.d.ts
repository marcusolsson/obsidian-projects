import type { DataFrame } from "./lib/dataframe/dataframe";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Intl {
    interface Locale {
      weekInfo: {
        firstDay: number;
      };
    }
  }
}

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
  // https://github.com/Fevol/obsidian-typings
  interface MenuItem {
    /**
     * @internal Add warning styling to the menu item
     * @param warning - Whether the menu item should be styled as a warning
     */
    setWarning(warning: boolean): this;
  }
  interface Vault {
    config: {
      accentColor: string;
    };
  }
}
