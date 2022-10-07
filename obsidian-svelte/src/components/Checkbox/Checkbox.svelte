<script lang="ts">
	import { createEventDispatcher } from "svelte";

	export let checked: boolean;

	const dispatch = createEventDispatcher<{ check: boolean }>();

	$: dispatch("check", checked);
</script>

<input type="checkbox" {checked} />
