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

    new Setting(containerEl)
      .setName("Experimental")
      .setDesc(
        "Experimental settings may be unstable and removed without notice."
      )
      .setHeading();

    new Setting(containerEl)
      .setName("Disable Link fields")
      .setDesc(
        "Link fields may interfere with text fields with rich-text formatting. By disabling Link fields, fields that were previously detected as Link fields will be detected as Text fields."
      )
      .addToggle((toggle) =>
        toggle
          .setValue(preferences.experimental.disableLinkFields)
          .onChange((value) => {
            save({
              ...preferences,
              experimental: {
                disableLinkFields: value,
              },
            });
          })
      );
  }
}
