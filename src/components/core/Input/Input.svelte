<script lang="ts">
	export let type: string = "text";
	export let value: string;
	export let onChange: (value: string) => void;
	export let readonly: boolean = false;

	function handleInput(event: Event) {
		if (event.currentTarget instanceof HTMLInputElement) {
			onChange(event.currentTarget.value);
		}
	}
</script>

<input {value} {type} on:input={handleInput} {readonly} />
