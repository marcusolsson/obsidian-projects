<script>
  export let text;
  export let value;
  export let disabled = false;
</script>

<option {value} {disabled}>{text || value}</option>
