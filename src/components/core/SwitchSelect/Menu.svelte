<script lang="ts">
	import { Checkbox } from "../Checkbox";

	interface SwitchItem {
		label: string;
		value: string;
		enabled: boolean;
	}

	export let items: SwitchItem[];
	export let onChange: (value: string, enabled: boolean) => void;
</script>

<div id="obsidian-projects--menu" class="menu">
	{#each items as item}
		<div class="menu-item">
			<Checkbox
				value={item.enabled}
				onChange={(enabled) => onChange(item.value, enabled)}
			/>
			<div class="menu-item-title">{item.label}</div>
		</div>
	{/each}
</div>
