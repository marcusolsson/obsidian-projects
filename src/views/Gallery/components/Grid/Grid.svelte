<script lang="ts">
  export let cardWidth: number;
</script>

<div
  class="projects-gallery-grid"
  style={`grid-template-columns: repeat(auto-fill, minmax(${cardWidth}px, 1fr));`}
>
  <slot />
</div>

<style>
  .projects-gallery-grid {
    display: grid;
    gap: 24px;
  }
</style>
