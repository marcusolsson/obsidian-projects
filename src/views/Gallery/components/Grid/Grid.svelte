<div>
  <slot />
</div>

<style>
  div {
    display: grid;
    gap: 24px;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
</style>
