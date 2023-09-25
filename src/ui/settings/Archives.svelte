<script lang="ts">
  import { IconButton, SettingItem } from "obsidian-svelte";

  import { i18n } from "src/lib/stores/i18n";
  import { Accordion, AccordionItem } from "src/ui/components/Accordion";
  import type { ProjectDefinition, ProjectId } from "src/settings/settings";

  export let archives: ProjectDefinition[];

</script>

<span>
  <Accordion>
    <AccordionItem>
      <div slot="header" class="setting-item-info" style:margin-top="8px">
        <div class="setting-item-name">
          {$i18n.t("modals.project.more-settings.name")}
        </div>
      </div>
      {#each archives as project}
        <SettingItem name={project.name} description={""}>
          <IconButton icon="trash" />
        </SettingItem>
      {/each}
    </AccordionItem>
  </Accordion>
</span>

<style>
</style>
