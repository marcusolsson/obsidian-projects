<script>
  /**
   * Specifies the value;
   */
  export let value;
  /**
   * Specifies the minimum allowed value.
   */
  export let min;
  /**
   * Specifies the maximum allowed value.
   */
  export let max;
  /**
   * Specifies the step size.
   */
  export let step;
</script>

<input
  bind:value
  type="range"
  class="slider"
  {min}
  {max}
  {step}
  on:change
  on:input
/>
