<script lang="ts">
	import { Checkbox } from "obsidian-svelte";

	export let label: string;
	export let value: string;
	export let onChange: (value: string, enabled: boolean) => void;
	export let enabled: boolean;
</script>

<div class="menu-item">
	<Checkbox
		checked={enabled}
		on:check={({ detail: enabled }) => onChange(value, enabled)}
	/>
	<div class="menu-item-title">{label}</div>
</div>
