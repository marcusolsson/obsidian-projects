<script lang="ts">
	import { Button } from "../core/Button";
	import { Typography } from "../core/Typography";
	import { i18n } from "../../lib/stores/i18n";

	export let title: string;
	export let message: string;
	export let cta: string;
	export let onConfirm: () => void;
	export let onCancel: () => void;
</script>

<div class="modal-title">{title}</div>
<div class="modal-content">
	<Typography variant="body">{message}</Typography>
</div>
<div class="modal-button-container">
	<Button
		variant={cta === $i18n.t("delete") ? "destructive" : "primary"}
		on:click={() => {
			onConfirm();
		}}>{cta}</Button
	>
	<Button
		on:click={() => {
			onCancel();
		}}
	>
		{$i18n.t("cancel")}
	</Button>
</div>
