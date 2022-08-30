<script lang="ts">
	export let title: string;
	export let note: string;
	export let selected: boolean = false;
</script>

<div class="suggestion-item mod-complex" class:is-selected={selected}>
	<div class="suggestion-content">
		<div class="suggestion-title">{title}</div>
		<div class="suggestion-note">{note}</div>
	</div>
	<div class="suggestion-aux" />
</div>
