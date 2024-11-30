<script lang="ts">
  import { onMount } from "svelte";

  import { createProject } from "src/lib/dataApi";
  import { api } from "src/lib/stores/api";
  import { i18n } from "src/lib/stores/i18n";
  import { app } from "src/lib/stores/obsidian";
  import { settings } from "src/lib/stores/settings";
  import { ViewApi } from "src/lib/viewApi";
  import { CreateProjectModal } from "src/ui/modals/createProjectModal";

  import Toolbar from "./toolbar/Toolbar.svelte";
  import { createDemoProject } from "./onboarding/demoProject";
  import { OnboardingModal } from "./onboarding/onboardingModal";
  import View from "./View.svelte";
  import DataFrameProvider from "./DataFrameProvider.svelte";
  import type {
    ProjectId,
    ViewDefinition,
    ViewId,
  } from "src/settings/settings";

  export let projectId: ProjectId | undefined;
  export let viewId: ViewId | undefined;

  $: ({ projects } = $settings);

  $: defaultProject = projects.find((project) => project.isDefault);

  $: project =
    projects.find((project) => projectId === project.id) ||
    defaultProject ||
    projects[0];

  $: views = project?.views || [];
  $: views, viewId, setView();

  let view: ViewDefinition | undefined;
  const setView = () => {
    const t = views.find((view) => viewId === view.id);
    if (!t) {
      viewId = views[0]?.id;
      view = views[0];
    } else {
      view = t;
    }
  };

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
<div class="projects-container">
  <Toolbar
    {projects}
    projectId={project?.id}
    onProjectChange={(id) => (projectId = id)}
    viewId={view?.id}
    onViewChange={(id) => (viewId = id)}
  />

  <div class="projects-main">
    {#if project}
      <DataFrameProvider {project} let:frame let:source>
        {#if project && view && source}
          <View
            {project}
            {view}
            readonly={source.readonly()}
            api={new ViewApi(source, $api)}
            onConfigChange={settings.updateViewConfig}
            {frame}
          />
        {/if}
        <slot {project} {view} {source} {frame} />
      </DataFrameProvider>
    {/if}
  </div>
</div>

<style>
  .projects-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .projects-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }
</style>
