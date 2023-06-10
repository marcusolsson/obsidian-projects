<div on:keypress on:click>
  <slot />
</div>

<style>
  div {
    height: 180px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid var(--background-modifier-border);
  }
</style>
