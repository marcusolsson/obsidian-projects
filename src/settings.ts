import { App, PluginSettingTab, Setting } from "obsidian";
import { settings } from "src/lib/stores/settings";
import { get } from "svelte/store";
import type ProjectsPlugin from "./main";
import type { ProjectsPluginPreferences } from "./main";

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
        .setValue(preferences.frontmatter.quoteStrings)
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
