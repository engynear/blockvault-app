<script>
    import "../app.scss";
    import SideBar from "$lib/SideBar.svelte";
</script>

<SideBar />

<div class="main">
    <slot />
</div>

<style>
    .main {
        margin-left: min(22%, 320px);
    }
</style>
