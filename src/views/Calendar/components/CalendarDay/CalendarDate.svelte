<script lang="ts">
  import dayjs from "dayjs";

  export let date: dayjs.Dayjs;

  $: today = date.startOf("day").isSame(dayjs().startOf("day"));
</script>

<span class:today>{date.date()}</span>

<style>
  span {
    padding: 0.2em 0.4em;
    border-radius: 4px;
    display: inline-block;
  }
  .today {
    background: var(--interactive-accent);
    color: var(--text-on-accent);
  }
</style>
