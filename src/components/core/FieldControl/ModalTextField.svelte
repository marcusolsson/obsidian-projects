<script lang="ts">
	import { TextField } from "../TextField";

	export let value: string | null;
	export let onCommit: (value: string) => void;

	// Used to revert to the previous cell value if the users revert their changes.
	let snapshot = value;

	let editing: boolean;

	function startEdit() {
		editing = true;

		// Take a snapshot to be able to revert changes.
		snapshot = value;
	}

	function stopEdit() {
		editing = false;
	}

	// Commit changes when cell loses focus.
	function handleBlur(event: FocusEvent) {
		if (editing) {
			stopEdit();
			onCommit(value);
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.target instanceof HTMLInputElement) {
			if (editing) {
				switch (event.key) {
					case "Enter":
						stopEdit();
						onCommit(value);
						break;
					case "Escape":
						value = snapshot;
						stopEdit();
						break;
				}
			} else {
				switch (event.key) {
					case "Enter":
						startEdit();
						break;
					case "Backspace":
						value = "";
						break;
					default:
						let isPrintableKey = event.key.length === 1;
						if (isPrintableKey) {
							startEdit();
							value = "";
						}
				}
			}
		}
	}

	function handleFocus(event: Event) {
		if (event.target instanceof HTMLInputElement) {
			// Clear selection on focus.
			event.target.selectionStart = event.target.selectionEnd;
		}
	}

	let ref: TextField;
	function handleDoubleClick(ev: MouseEvent) {
		startEdit();
		ref.focus();
	}
</script>

<!--
	@component

	A modal text field.

	The user can switch between the View and Edit mode. In Edit mode, the value
	can either by committed or discarded.

	- While in Edit mode, changes are committed when the user presses the Enter key,
	or when the input loses focus.
	- The user can enter Edit mode by pressing Enter when the cell is focused, or by
	double clicking it.
-->
<TextField
	bind:this={ref}
	bind:value
	on:keydown={handleKeyDown}
	on:blur={handleBlur}
	on:focus={handleFocus}
	on:dblclick={handleDoubleClick}
	readonly={!editing}
/>
