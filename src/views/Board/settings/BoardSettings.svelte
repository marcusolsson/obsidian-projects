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

	let listWidthValue = config.listWidth ?? null;
</script>

<ModalLayout title="Board settings">
	<ModalContent>
		<SettingItem name="List width" description="Width of list in pixels.">
			<NumberInput
				placeholder="270"
				bind:value={listWidthValue}
				on:blur={() =>
					onSave(
						produce(config, (draft) => {
							const { listWidth, ...rest } = draft;
							if (!listWidthValue) {
								return rest;
							}
							return { ...rest, listWidth: listWidthValue };
						})
					)}
			/>
		</SettingItem>
	</ModalContent>
</ModalLayout>
