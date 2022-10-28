<script lang="ts">
  export let fullWidth: boolean = false;
  export let alignItems: string = "center";
  export let padding: boolean = false;
</script>

<div class:padding class:fullWidth style={`align-items: ${alignItems}`}>
  <slot />
</div>

<style>
  div {
    display: flex;
    gap: 8px;
  }

  .padding {
    padding: 8px;
  }

  .fullWidth {
    width: 100%;
    justify-content: space-between;
  }
</style>
