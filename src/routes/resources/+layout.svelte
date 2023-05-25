<script>
    import ResourceList from "$lib/ResourceList.svelte";
</script>

<div class="layout">
    <div class="resource-grid-container">
        <slot />
    </div>

    <ResourceList />
</div>

<style>
    .resource-grid-container {
        margin-right: min(calc(22vw + 16px*2), calc(320px + 16px*2));
    }
</style>
