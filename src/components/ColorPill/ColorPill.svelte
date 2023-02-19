<script lang="ts">
    export let color: string;
    export let width: string = "5px";
</script>

<span
        class="projects-color-pill"
        style:background-color={color}
        style:width
/>

<style>
    .projects-color-pill {
        height: 100%;
        border-radius: 9999px;
    }
</style>
