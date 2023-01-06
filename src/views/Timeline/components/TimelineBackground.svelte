<script lang="ts">
  import type dayjs from "dayjs";
  import TimelineHeader from "./TimelineHeader.svelte";

  export let isOneDay: boolean;
  export let dates: dayjs.Dayjs[];
  export let interval: string;
</script>

<table id="background">
  <TimelineHeader {dates} isOneDay={interval == "day"} />

  <tbody>
    <tr>
      {#each dates as date}
        <td class:weekend={date.day() === 0 || date.day() === 6}>
          <div />
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
    font-size: 75%;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
    table-layout: fixed;
    width: 100%;
    /* position: absolute; */
    /* z-index: -5; */
  }
  #background {
    /* display: flex; */
    position: relative;
    height: 100vh;
  }
  .weekend {
    background-color: var(--background-secondary);
  }
</style>
