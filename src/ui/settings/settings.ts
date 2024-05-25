import { App, Platform, PluginSettingTab, Setting } from "obsidian";
import Projects from "src/ui/settings/Projects.svelte";
import Archives from "src/ui/settings/Archives.svelte";
import { settings } from "src/lib/stores/settings";
import { get } from "svelte/store";
import type ProjectsPlugin from "src/main";
import type {
  FirstDayOfWeek,
  LinkBehavior,
  ProjectId,
  ProjectsPluginPreferences,
} from "src/settings/settings";
import { i18n } from "src/lib/stores/i18n";

/**
 * ProjectsSettingTab builds the plugin settings tab.
 */
export class ProjectsSettingTab extends PluginSettingTab {
  constructor(app: App, readonly plugin: ProjectsPlugin) {
    super(app, plugin);
  }

  // display runs when the user opens the settings tab.
  display(): void {
    let { preferences } = get(settings);

    const save = (prefs: ProjectsPluginPreferences) => {
      preferences = prefs;
      settings.updatePreferences(prefs);
    };

    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName(get(i18n).t("settings.general.size-limit.name"))
      .setDesc(get(i18n).t("settings.general.size-limit.desc"))
      .addText((text) =>
        text
          .setValue(preferences.projectSizeLimit.toString())
          .setPlaceholder("1000")
          .onChange((value) => {
            save({
              ...preferences,
              projectSizeLimit: parseInt(value) || 1000,
            });
          })
      );

    new Setting(containerEl)
      .setName(get(i18n).t("settings.general.link-behavior.name"))
      .setDesc(
        get(i18n).t("settings.general.link-behavior.desc", {
          modifier: Platform.isMacOS ? "Cmd" : "Ctrl",
        })
      )
      .addDropdown((dropdown) => {
        dropdown
          .addOptions({
            "open-editor": get(i18n).t(
              "settings.general.link-behavior.options.open-editor"
            ),
            "open-note": get(i18n).t(
              "settings.general.link-behavior.options.open-note"
            ),
          })
          .setValue(preferences.linkBehavior)
          .onChange((value) => {
            save({
              ...preferences,
              linkBehavior: value as LinkBehavior,
            });
          });
      });

    new Setting(containerEl)
      .setName(get(i18n).t("settings.general.start-of-week.name"))
      .addDropdown((dropdown) =>
        dropdown
          .addOption(
            "default",
            get(i18n).t("settings.general.start-of-week.options.default")
          )
          .addOption(
            "sunday",
            get(i18n).t("settings.general.start-of-week.options.sunday")
          )
          .addOption(
            "monday",
            get(i18n).t("settings.general.start-of-week.options.monday")
          )
          .setValue(
            preferences.locale.firstDayOfWeek
              ? preferences.locale.firstDayOfWeek.toString()
              : "default"
          )
          .onChange((value) => {
            save({
              ...preferences,
              locale: {
                firstDayOfWeek: value as FirstDayOfWeek,
              },
            });
          })
      );

    new Setting(containerEl)
      .setName(get(i18n).t("settings.front-matter.heading"))
      .setHeading();

    new Setting(containerEl)
      .setName(get(i18n).t("settings.front-matter.quote-strings.name"))
      .addDropdown((dropdown) =>
        dropdown
          .addOption(
            "PLAIN",
            get(i18n).t("settings.front-matter.quote-strings.options.plain")
          )
          .addOption(
            "QUOTE_DOUBLE",
            get(i18n).t(
              "settings.front-matter.quote-strings.options.quote-double"
            )
          )
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
      .setName(get(i18n).t("settings.commands.name"))
      .setDesc(get(i18n).t("settings.commands.desc"))
      .setHeading();

    const projectsManager = new Projects({
      target: containerEl,
      props: {
        save,
        preferences,
        projects: get(settings).projects,
      },
    });

    new Setting(containerEl)
      .setName(get(i18n).t("settings.archives.name"))
      .setDesc(get(i18n).t("settings.archives.desc"))
      .setHeading();

    const archivesManager = new Archives({
      target: containerEl,
      props: {
        archives: get(settings).archives,
        onRestore: (archiveId: ProjectId) => {
          settings.restoreArchive(archiveId);
          archivesManager.$set({ archives: get(settings).archives });
          projectsManager.$set({ projects: get(settings).projects });
        },
        onDelete: (archiveId: ProjectId) => {
          settings.deleteArchive(archiveId);
          archivesManager.$set({ archives: get(settings).archives });
        },
      },
    });
  }
}
