<script>
    import ResourcepackCard from "$lib/resource-cards/ResourcepackCard.svelte";
    import { onMount } from "svelte";

    const apiURL = import.meta.env.VITE_API_URL;
    let resourcepacks = [];
    let searchValue = "";
    let filteredResourcepacks = [];

    onMount(async () => {
        await loadResourcepacks();
    });

    const loadResourcepacks = async () => {
        const response = await fetch(`${apiURL}/resourcepacks`);
        response.json().then((data) => {
            resourcepacks = data;
        });

        if (!response.ok) {
            console.error("Ошибка при загрузке пакетов ресурсов");
            return;
        }
    };

    $: {
        if (searchValue === "") {
            filteredResourcepacks = resourcepacks;
        } else {
            filteredResourcepacks = resourcepacks.filter((resourcepack) =>
                resourcepack.name
                    .toLowerCase()
                    .includes(searchValue.toLowerCase())
            );
        }
    }

    let selectedResourcepacks = [];
    function handleSelection(resourcepack, isSelected) {
        console.log("Selected resourcepack", resourcepack);
        if (isSelected) {
            selectedResourcepacks.push(resourcepack);
        } else {
            selectedResourcepacks = selectedResourcepacks.filter(
                (rp) => rp.id !== resourcepack.id
            );
        }
        selectedResourcepacks = selectedResourcepacks;
    }

    let isPanelVisible = false;
    $: {
        isPanelVisible = selectedResourcepacks.length > 0;
    }

    const downloadAllResourcepacks = async () => {
        const downloadPromises = selectedResourcepacks.map(
            async (resourcepack) => {
                const response = await fetch(
                    `${apiURL}/resourcepacks/${resourcepack.id}/file`
                );

                if (!response.ok) {
                    console.error(
                        `Error downloading resourcepack with ID ${resourcepack.id}`
                    );
                    return;
                }

                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = downloadUrl;
                link.download = `${resourcepack.name}.zip`;
                link.click();
                window.URL.revokeObjectURL(downloadUrl);
            }
        );

        await Promise.all(downloadPromises);
    };

    const cancelSelection = () => {
        selectedResourcepacks = [];
    };

    const deleteAllResourcepacks = async () => {
        const deletePromises = selectedResourcepacks.map(
            async (resourcepack) => {
                const response = await fetch(
                    `${apiURL}/resourcepacks/${resourcepack.id}`,
                    {
                        method: "DELETE",
                    }
                );

                if (!response.ok) {
                    console.error(
                        `Error deleting resourcepack with ID ${resourcepack.id}`
                    );
                }
            }
        );

        await Promise.all(deletePromises);
        resourcepacks = resourcepacks.filter(
            (rp) => !selectedResourcepacks.includes(rp)
        );
        selectedResourcepacks = [];
    };
</script>

<svelte:head>
    <title>Пакеты ресурсов</title>
</svelte:head>

<header>
    <h1 class="page-title">Пакеты ресурсов</h1>
    <input
        type="text"
        placeholder="Поиск по названию"
        bind:value={searchValue}
        class="search-input"
    />
</header>

{#if filteredResourcepacks.length === 0}
    <div class="no-resourcepacks">
        <p>Нет найдено пакетов ресурсов</p>
        <i class="fa fa-exclamation-circle" />
    </div>
{:else}
    <div class="resourcepacks-grid">
        {#each filteredResourcepacks as resourcepack}
            <ResourcepackCard
                {resourcepack}
                isSelected={selectedResourcepacks.some(
                    (rp) => rp.id === resourcepack.id
                )}
                handleSelection={(resourcepack, isSelected) =>
                    handleSelection(resourcepack, isSelected)}
            />
        {/each}
    </div>
{/if}

{#if isPanelVisible}
    <div class="panel">
        <button class="panel-button" on:click={downloadAllResourcepacks}>
            <i class="fas fa-download" /> Скачать все пакеты ресурсов
        </button>
        <button class="panel-button" on:click={cancelSelection}>
            <i class="fas fa-times" /> Отменить выделение
        </button>
        <button class="panel-button" on:click={deleteAllResourcepacks}>
            <i class="fas fa-trash" /> Удалить все пакеты ресурсов
        </button>
    </div>
{/if}

<style>
    @import url("https://fonts.googleapis.com/css?family=Montserrat:300,400,500,700&display=swap");

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: "Montserrat", sans-serif;
        background-color: #f5f5f5;
        color: #333;
        padding: 20px;
    }

    header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
    }

    .page-title {
        font-size: 24px;
        font-weight: 500;
    }

    .search-input {
        padding: 5px;
        font-size: 14px;
        border-radius: 5px;
        border: 1px solid #ddd;
    }

    .no-resourcepacks {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 200px;
        font-size: 16px;
        color: #555;
    }

    .no-resourcepacks i {
        margin-top: 10px;
        font-size: 24px;
        color: #ccc;
    }

    .resourcepacks-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        grid-gap: 20px;
    }

    .panel {
        position: fixed;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 10px;
        width: 50%;
        display: flex;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.8);
        padding: 10px;
        box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
        /* z-index: 999; */
    }

    .panel-button {
        margin: 0 10px;
        background-color: #ffc087;
        border: none;
        cursor: pointer;
        font-family: Montserrat;
        font-weight: 600;
        font-size: 1rem;
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border-radius: 5px;
        transition: background-color 0.3s ease;
    }

    .panel-button:hover {
        background-color: #ffa86f;
    }

    .panel-button i {
        margin-right: 5px;
    }
</style>
