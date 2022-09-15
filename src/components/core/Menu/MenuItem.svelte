<script lang="ts">
	import { Checkbox } from "../Checkbox";

	export let label: string;
	export let value: string;
	export let onChange: (value: string, enabled: boolean) => void;
	export let enabled: boolean;
</script>

<div class="menu-item">
	<Checkbox
		value={enabled}
		onChange={(enabled) => onChange(value, enabled)}
	/>
	<div class="menu-item-title">{label}</div>
</div>
