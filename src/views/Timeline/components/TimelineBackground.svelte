<script lang="ts">
  import type dayjs from "dayjs";

	export let isOneDay: boolean;
	export let dates: dayjs.Dayjs[]
</script>
<table id="background">
	<tbody>
		<tr>
			{#each dates as date}
				<td class:weekend={date.day() === 0 || date.day() === 6}>
					<div>
					
					</div>
				</td>
			{/each}
		</tr>
	</tbody>
	<!-- {#each dates as date}
		<div class="timeline-section" class:weekend={date.day() === 0 || date.day() === 6}>
			
		</div> 
		<span class="day-outer">
			<span class="timeline-date"></span>
		</span>
		<div class="timeline-area">

		</div>
	{/each} -->
</table>
<style>
	td {
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
		width: 100%;
		position: absolute;
		/* z-index: -5; */
	}
	#background {
		/* display: flex; */
		position: absolute;
		height: 100%
	}
	.weekend {
    background-color: var(--background-secondary);
  }
</style>