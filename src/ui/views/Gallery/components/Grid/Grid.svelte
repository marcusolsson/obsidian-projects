<script lang="ts">
  export let cardWidth: number;
</script>

<section
  class="projects--gallery--grid"
  style={`grid-template-columns: repeat(auto-fill, minmax(${cardWidth}px, 1fr));`}
>
  <slot />
</section>
