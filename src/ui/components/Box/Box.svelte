<script lang="ts">
  export let direction: "row" | "column" = "column";
  export let gap: number = 0;
  export let padding: number = 0;
  export let margin: number = 0;
</script>

<div
  style:flex-direction={direction}
  style:gap={gap + "px"}
  style:padding={padding + "px"}
  style:margin={margin + "px"}
  {...$$restProps}
>
  <slot />
</div>

<style>
  div {
    display: flex;
  }
</style>
