<script lang="ts">
	export let text: string;
	export let value: string;
	export let disabled: boolean = false;
</script>

<option {value} {disabled}>{text || value}</option>
