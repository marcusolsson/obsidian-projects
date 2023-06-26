<script lang="ts">
  export let padding: boolean = false;
</script>

<div class:padding>
  <slot />
</div>

<style>
  div {
    flex: 1;
    overflow: auto;
  }

  .padding {
    padding: 24px;
  }
</style>
