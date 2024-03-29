<script>
  import { Autocomplete } from "./";
  /**
   * Specify the text input value.
   */
  export let value;
  /**
   * Specify the files to select from.
   */
  export let files;
  /**
   * Specify a function to format the label.
   */
  export let getLabel = (file) => file.name;
  /**
   * Specify a function to format the description.
   */
  export let getDescription = () => "";
  /**
   * Input props.
   */
  export let embed = false;
  export let readonly = false;
  export let placeholder = "";
  export let width = "auto";
  export let autoFocus = false;
  $: options = files.map((file) => ({
    label: getLabel(file),
    description: getDescription(file),
  }));
</script>

<Autocomplete
  bind:value
  bind:options
  on:change
  on:blur
  {readonly}
  {placeholder}
  {width}
  {embed}
  {autoFocus}
/>
