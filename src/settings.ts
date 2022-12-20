import { App, PluginSettingTab, Setting } from "obsidian";
import type { ProjectsPluginPreferences } from "./main";
import type ProjectsPlugin from "./main";
import { get } from "svelte/store";
import { settings } from "src/lib/stores/settings";

export class ProjectsSettingTab extends PluginSettingTab {
  constructor(app: App, readonly plugin: ProjectsPlugin) {
    super(app, plugin);
  }

  display(): void {
    const { preferences } = get(settings);

    const save = (prefs: ProjectsPluginPreferences) => {
      settings.updatePreferences(prefs);
    };
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl).setName("Front matter").setHeading();

    new Setting(containerEl).setName("Quote strings").addDropdown((dropdown) =>
      dropdown
        .addOption("PLAIN", "If needed")
        .addOption("QUOTE_DOUBLE", "Always")
        .setValue(preferences?.frontmatter?.quoteStrings ?? "PLAIN")
        .onChange((value) => {
          if (value === "PLAIN" || value === "QUOTE_DOUBLE") {
            save({
              ...preferences,
              frontmatter: {
                quoteStrings: value,
              },
            });
          }
        })
    );
  }
}
