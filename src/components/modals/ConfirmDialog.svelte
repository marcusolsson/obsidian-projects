<script lang="ts">
	import { Setting } from "obsidian";
	import { Typography } from "../core/Typography";

	export let onConfirm: () => void;
	export let onCancel: () => void;

	function setting(node: HTMLElement) {
		new Setting(node)
			.addButton((button) => {
				button.setButtonText("Cancel").onClick(() => onCancel());
			})
			.addButton((button) => {
				button
					.setButtonText("Delete")
					.setCta()
					.onClick(() => onConfirm());
			});
	}
</script>

<Typography variant="h1">Confirm</Typography>
<Typography variant="body">
	Are you sure you want to delete this view?
</Typography>

<div use:setting />
