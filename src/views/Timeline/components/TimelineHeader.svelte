<script lang="ts">
  import type dayjs from "dayjs";

	export let isOneDay: boolean;
	export let dates: dayjs.Dayjs[]
</script>
<table>
	<thead>
		<tr>
			{#each dates as date}
				<th class:weekend={date.day() === 0 || date.day() === 6}>
					<div class="innert">
						{isOneDay ? date.format("h:mm") : date.date()}
					</div>
				</th>
			{/each}
		</tr>
	</thead>
</table>
<style>
	th {
		width: 100%;
		border: 1px solid var(--background-modifier-border);
	}
	tr {
		font-size: 75%
	}
	table {
		border-collapse: collapse;
		border-spacing: 0;
		table-layout: fixed;
		width: 100%
	}
</style>
