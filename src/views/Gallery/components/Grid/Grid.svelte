<script lang="ts">
  export let cardWidth: number;
</script>

<div
  style={`grid-template-columns: repeat(auto-fill, minmax(${cardWidth}px, 1fr));`}
>
  <slot />
</div>

<style>
  div {
    display: grid;
    gap: 24px;
  }
</style>
