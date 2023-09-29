<script lang="ts">
  import produce from "immer";
  import { Callout, SettingItem, Typography, Switch } from "obsidian-svelte";

  import { settings } from "src/lib/stores/settings";
  import type { ProjectsPluginPreferences } from "../../settings/settings";

  const save = (prefs: ProjectsPluginPreferences) => {
    preferences = prefs;
    settings.updatePreferences(prefs);
  };

  $: ({ projects } = $settings);
  $: ({ preferences } = $settings);
</script>

{#if !projects.length}
  <Callout title={"Info"} icon="info" variant="info">
    <Typography variant="body">No project yet.</Typography>
  </Callout>
{:else}
  {#each projects as project}
    <SettingItem name={`${project.name}`} description={"Project"}>
      <Switch
        checked={!!preferences.commands.find(
          (command) => command.project == project.id && !command.view
        )}
        on:check={({ detail }) => {
          save(
            produce(preferences, (draft) => {
              if (detail) {
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
        }}
      />
    </SettingItem>
    {#each project.views as view}
      <SettingItem name={`${project.name}: ${view.name}`} description="View">
        <Switch
          checked={!!preferences.commands.find(
            (command) =>
              command.project == project.id && command.view === view.id
          )}
          on:check={({ detail }) => {
            save(
              produce(preferences, (draft) => {
                if (detail) {
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
          }}
        />
      </SettingItem>
    {/each}
  {/each}
{/if}
