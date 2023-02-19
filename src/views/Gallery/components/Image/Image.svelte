<script lang="ts">
  export let alt: string;
  export let src: string;
  export let fit: string;
</script>

<img class="projects-gallery-image" {alt} {src} style:object-fit={fit} />

<style>
  .projects-gallery-image {
    width: 100%;
    height: 100%;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
</style>
