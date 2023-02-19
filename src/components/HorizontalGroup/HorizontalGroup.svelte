<script lang="ts">
  export let fullWidth: boolean = false;
  export let alignItems: string = "center";
  export let padding: boolean = false;
</script>

<div class="projects-horizontal-group" class:padding class:fullWidth style={`align-items: ${alignItems}`}>
  <slot />
</div>

<style>
  .projects-horizontal-group {
    display: flex;
    gap: 8px;
  }

  .fullWidth {
    width: 100%;
    justify-content: space-between;
  }

  .padding {
    padding: 8px;
  }
</style>
