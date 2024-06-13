<script lang="ts">
  import { Button, Icon, Popover } from "obsidian-svelte";
  import { Flair } from "src/ui/components/Flair";

  export let label: string;
  export let icon: string;
  export let count: number;
  export let disabled: boolean;

  let ref: HTMLButtonElement;
  let isOpen: boolean = false;
</script>

<Button
  bind:ref
  on:click={() => {
    isOpen = !isOpen;
  }}
  {disabled}
>
  <Icon name={icon} />
  {label}
  {#if count}
    <Flair variant="primary">{count}</Flair>
  {/if}
</Button>
<Popover
  className={"projects--popover"}
  anchorEl={ref}
  open={isOpen}
  onClose={() => {
    isOpen = false;
  }}
  placement="auto"
>
  <slot />
</Popover>
