<script lang="ts">
  import { onMount } from "svelte";

  import { createProject } from "src/lib/data-api";
  import { api } from "src/lib/stores/api";
  import { i18n } from "src/lib/stores/i18n";
  import { app } from "src/lib/stores/obsidian";
  import { settings } from "src/lib/stores/settings";
  import { ViewApi } from "src/lib/view-api";
  import { CreateProjectModal } from "src/modals/create-project-modal";

  import AppContainer from "./AppContainer.svelte";
  import { createDemoProject } from "./onboarding/demo-project";
  import { OnboardingModal } from "./onboarding/onboarding-modal";
  import View from "./View.svelte";

  let projectId: string | undefined;
  let viewId: string | undefined;

  $: ({ projects } = $settings);

  onMount(() => {
    if (!projects.length) {
      new OnboardingModal(
        $app,
        // Create from scratch.
        () => {
          new CreateProjectModal(
            $app,
            $i18n.t("modals.project.create.title"),
            $i18n.t("modals.project.create.cta"),
            settings.addProject,
            createProject()
          ).open();
        },
        // Try demo project.
        () => {
          createDemoProject($app.vault);
        }
      ).open();
    }
  });
</script>

<!--
	@component

	App is the main application component and coordinates between the View and
	the Toolbar.
-->
<AppContainer
  {projects}
  bind:projectId
  bind:viewId
  let:project
  let:view
  let:source
  let:frame
>
  {#if project && view && source}
    <View
      {project}
      {view}
      readonly={source.readonly()}
      api={new ViewApi($app, source, $api)}
      onConfigChange={settings.updateViewConfig}
      {frame}
    />
  {/if}
</AppContainer>
