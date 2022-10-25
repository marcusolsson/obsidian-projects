<script lang="ts">
	import produce from "immer";
	import {
		SettingItem,
		NumberInput,
		ModalLayout,
		ModalContent,
	} from "obsidian-svelte";
	import type { BoardConfig } from "../types";

	export let config: BoardConfig;
	export let onSave: (config: BoardConfig) => void;

	let columnWidthValue = config.columnWidth ?? null;
</script>

<ModalLayout title="Board settings">
	<ModalContent>
		<SettingItem
			name="Column width"
			description="Width of each column in pixels."
		>
			<NumberInput
				placeholder="270"
				bind:value={columnWidthValue}
				on:blur={() =>
					onSave(
						produce(config, (draft) => {
							const { columnWidth, ...rest } = draft;
							if (!columnWidthValue) {
								return rest;
							}
							return { ...rest, columnWidth: columnWidthValue };
						})
					)}
			/>
		</SettingItem>
	</ModalContent>
</ModalLayout>
