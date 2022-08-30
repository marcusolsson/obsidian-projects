<script lang="ts">
	import { Setting } from "obsidian";
	import { Typography } from "../core/Typography";

	export let message: string;
	export let cta: string;
	export let onConfirm: () => void;
	export let onCancel: () => void;

	function setting(node: HTMLElement) {
		new Setting(node)
			.addButton((button) => {
				button.setButtonText("Cancel").onClick(() => onCancel());
			})
			.addButton((button) => {
				button
					.setButtonText(cta)
					.setCta()
					.onClick(() => onConfirm());
			});
	}
</script>

<Typography variant="body">{message}</Typography>

<div use:setting />
