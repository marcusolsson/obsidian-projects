<script lang="ts">
	export let type: string = "text";
	export let value: string;
	export let onChange: (value: string) => void;
	export let readonly: boolean = false;
	export let placeholder: string = "";

	function handleInput(event: Event) {
		if (event.currentTarget instanceof HTMLInputElement) {
			onChange(event.currentTarget.value);
		}
	}
</script>

<input {value} {type} {placeholder} on:input={handleInput} {readonly} />
