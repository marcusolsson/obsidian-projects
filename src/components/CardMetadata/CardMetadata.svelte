<script lang="ts">
  import { Icon } from "obsidian-svelte";
  import { DataFieldType, type DataField, type DataRecord } from "src/lib/data";
  import Checkbox from "./Checkbox.svelte";
  import Tags from "./Tags.svelte";
  import Text from "./Text.svelte";
  import Date from "./Date.svelte";
  import Number from "./Number.svelte";

  export let fields: DataField[];
  export let record: DataRecord;
</script>

{#each fields as field (field.name)}
  {@const value = record.values[field.name]}
  {#if value !== undefined && value !== null}
    <div class="projects-field-label">
      <div class="setting-item-description">
        {field.name}
      </div>
      {#if field.repeated}
        {#if field.type === DataFieldType.String}
          <Tags {field} {value} />
        {/if}
      {:else if field.type === DataFieldType.Boolean}
        <Checkbox {field} {value} />
      {:else if field.type === DataFieldType.String}
        <Text {field} {value} />
      {:else if field.type === DataFieldType.Number}
        <Number {field} {value} />
      {:else if field.type === DataFieldType.Date}
        <Date {value} {field} />
      {:else}
        <Icon name="slash" />
      {/if}
    </div>
  {/if}
{/each}

<style>
  .projects-field-label {
    margin-bottom: 8px;
  }

  .projects-field-label:first-child {
    margin-bottom: 4px;
  }

  .projects-field-label:last-child {
    margin-bottom: 0;
  }
</style>
