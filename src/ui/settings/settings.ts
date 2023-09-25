import produce from "immer";
import { App, Platform, PluginSettingTab, Setting } from "obsidian";
import Archives from "src/ui/settings/Archives.svelte";
import { settings } from "src/lib/stores/settings";
import { get } from "svelte/store";
import type ProjectsPlugin from "../../main";
import type {
  LinkBehavior,
  ProjectsPluginPreferences,
} from "../../settings/settings";

/**
 * ProjectsSettingTab builds the plugin settings tab.
 */
export class ProjectsSettingTab extends PluginSettingTab {
  constructor(app: App, readonly plugin: ProjectsPlugin) {
    super(app, plugin);
  }

  // display runs when the user opens the settings tab.
  display(): void {
    const { projects } = get(settings);
    const { archives } = get(settings);
    let { preferences } = get(settings); //TODO: remove commands upon delete! and archive?

    const save = (prefs: ProjectsPluginPreferences) => {
      preferences = prefs;
      settings.updatePreferences(prefs);
    };

    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("Project size limit")
      .setDesc("Avoid accidentally loading too many notes. Increasing ")
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
      .setName("Link behavior")
      .setDesc(
        `Determines what happens when you select the link of a note. Press ${
          Platform.isMacOS ? "Cmd" : "Ctrl"
        } while selecting link for opposite behavior.`
      )
      .addDropdown((dropdown) => {
        dropdown
          .addOptions({
            "open-editor": "Open editor",
            "open-note": "Open note",
          })
          .setValue(preferences.linkBehavior)
          .onChange((value) => {
            save({
              ...preferences,
              linkBehavior: value as LinkBehavior,
            });
          });
      });

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
      .setName("Commands")
      .setDesc("Add commands for your favorite projects and views.")
      .setHeading();

    projects.forEach((project) => {
      new Setting(containerEl)
        .setName(project.name)
        .setDesc("Project")
        .addToggle((toggle) =>
          toggle
            .setValue(
              !!preferences.commands.find(
                (command) => command.project == project.id && !command.view
              )
            )
            .onChange((value) => {
              save(
                produce(preferences, (draft) => {
                  if (value) {
                    draft.commands.push({
                      project: project.id,
                    });
                  } else {
                    draft.commands = draft.commands.filter(
                      (command) =>
                        !(command.project === project.id && !command.view)
                    );
                  }
                })
              );
            })
        );

      project.views.forEach((view) => {
        new Setting(containerEl)
          .setName(`${project.name}: ${view.name}`)
          .setDesc("View")
          .addToggle((toggle) =>
            toggle
              .setValue(
                !!preferences.commands.find(
                  (command) =>
                    command.project == project.id && command.view === view.id
                )
              )
              .onChange((value) => {
                save(
                  produce(preferences, (draft) => {
                    if (value) {
                      draft.commands.push({
                        project: project.id,
                        view: view.id,
                      });
                    } else {
                      draft.commands = draft.commands.filter(
                        (command) =>
                          !(
                            command.project === project.id &&
                            command.view === view.id
                          )
                      );
                    }
                  })
                );
              })
          );
      });
    });

    new Setting(containerEl)
      .setName("Archives")
      .setDesc("View, preview, restore or delete your archived projects.")
      .setHeading();

    new Archives({
      target: containerEl,
      props: {
        archives: archives,
      },
    });

    archives.forEach((archive) => {
      new Setting(containerEl)
        .setName(archive.name)
        .setDesc("Archived project")
        .addExtraButton((button) =>
          button
            .setIcon("view")
            .setTooltip("Preview the archived project temproraly.")
        ) // Preview the project, readonly
        .addExtraButton((button) =>
          button
            .setIcon("archive-restore")
            .setTooltip("Restore archive xxx(hint the name)")
        ) // restore archive, update the list.
        .addExtraButton((button) =>
          button
            .setIcon("trash-2")
            .setTooltip("Delete this archive, add name hint")
        ) // delete archive, abandon it.
        .addToggle((toggle) =>
          toggle
            .setValue(
              !!preferences.commands.find(
                (command) => command.project == archive.id && !command.view
              )
            )
            .onChange((value) => {
              save(
                produce(preferences, (draft) => {
                  if (value) {
                    draft.commands.push({
                      project: archive.id,
                    });
                  } else {
                    draft.commands = draft.commands.filter(
                      (command) =>
                        !(command.project === archive.id && !command.view)
                    );
                  }
                })
              );
            })
        );
    });
  }
}
