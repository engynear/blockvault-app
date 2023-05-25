<script>
    import SoundCard from "$lib/resource-cards/SoundCard.svelte";
    import AddSoundModal from "$lib/modals/AddSoundModal.svelte";
    import { onMount, onDestroy } from "svelte";
    import { selectedSounds } from "$lib/store.js";

    const apiURL = import.meta.env.VITE_API_URL;
    let sounds = [];
    let unsubscribeSelectedSounds;
    let isAddingSound = false;

    onMount(async () => {
        await loadSounds();
        unsubscribeSelectedSounds = selectedSounds.subscribe((value) => {
            selectedSoundsValue = value;
        });
    });

    onDestroy(() => {
        if (unsubscribeSelectedSounds) {
            unsubscribeSelectedSounds();
        }
    });

    const loadSounds = async () => {
        const response = await fetch(`${apiURL}/sounds`);
        response.json().then((data) => {
            sounds = data;
        });

        if (!response.ok) {
            sounds = [];
            console.error("Ошибка при загрузке звуков");
            return;
        }
    };

    let filteredSounds = [];
    let searchValue = "";

    $: {
        if (searchValue === "") {
            filteredSounds = sounds;
        } else {
            filteredSounds = sounds.filter((sound) =>
                sound.name.toLowerCase().includes(searchValue.toLowerCase())
            );
        }
    }

    let selectedSoundsValue = [];

    function handleSelection(sound, isSelected) {
        if (isSelected) {
            selectedSoundsValue.push(sound);
        } else {
            selectedSoundsValue = selectedSoundsValue.filter(
                (s) => s.id !== sound.id
            );
        }
        selectedSounds.set(selectedSoundsValue);
    }

    async function handleAddSound(soundData, soundFile) {
        const addSound = await fetch(`${apiURL}/sounds`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(soundData),
        });

        if (!addSound.ok) {
            console.error("Ошибка при добавлении звука");
            return;
        }

        const newSound = await addSound.json();

        const formUploadSoundFile = new FormData();
        formUploadSoundFile.set("file", soundFile);
        const uploadSoundFile = await fetch(
            `${apiURL}/sounds/${newSound.id}/clip`,
            {
                method: "POST",
                body: formUploadSoundFile,
            }
        );

        if (!uploadSoundFile.ok) {
            console.error("Ошибка при загрузке звукового файла на сервер");
            return;
        }

        sounds.push(newSound);
        sounds = sounds;
        isAddingSound = false;
    }

    let isPanelVisible = false;

    const downloadAllSounds = async () => {
        const downloadPromises = selectedSoundsValue.map(async (sound) => {
            const response = await fetch(`${apiURL}/sounds/${sound.id}/clip`);
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = `${sound.name}.ogg`;
            link.click();
            window.URL.revokeObjectURL(downloadUrl);
        });

        await Promise.all(downloadPromises);
    };

    const cancelSelection = () => {
        selectedSoundsValue = [];
        selectedSounds.set(selectedSoundsValue);
    };

    const deleteAllSounds = async () => {
        const deletePromises = selectedSoundsValue.map(async (sound) => {
            const response = await fetch(`${apiURL}/sounds/${sound.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                console.error(`Error deleting sound with ID ${sound.id}`);
            }
        });

        await Promise.all(deletePromises);
        sounds = sounds.filter((sound) => !selectedSoundsValue.includes(sound));
        selectedSoundsValue = [];
        selectedSounds.set(selectedSoundsValue);
    };

    $: {
        isPanelVisible = selectedSoundsValue.length > 0;
    }
</script>

<svelte:head>
    <title>Звуки</title>
</svelte:head>

<header>
    <h1 class="page-title">Звуки</h1>
    <input
        type="text"
        placeholder="Поиск по названию"
        bind:value={searchValue}
        class="search-input"
    />

    <button class="button-add-sound" on:click={() => (isAddingSound = true)}>
        Добавить звук
    </button>
</header>

{#if filteredSounds.length === 0}
    <div class="no-sounds">
        <p>Нет найдено звуков</p>
        <i class="fa fa-exclamation-circle"></i>
    </div>
{:else}
    <div class="sounds-list">
        {#each filteredSounds as sound}
            <SoundCard
                {sound}
                isSelected={selectedSoundsValue.some((s) => s.id === sound.id)}
                handleSelection={(sound, isSelected) =>
                    handleSelection(sound, isSelected)}
            />
        {/each}
    </div>
{/if}

{#if isPanelVisible}
    <div class="panel">
        <button class="panel-button" on:click={downloadAllSounds}>
            <i class="fas fa-download"></i> Скачать все звуки
        </button>
        <button class="panel-button" on:click={cancelSelection}>
            <i class="fas fa-times"></i> Отменить выделение
        </button>
        <button class="panel-button" on:click={deleteAllSounds}>
            <i class="fas fa-trash"></i> Удалить все звуки
        </button>
    </div>
{/if}

<AddSoundModal
    isOpen={isAddingSound}
    onSubmit={handleAddSound}
    onClose={() => (isAddingSound = false)}
/>

<style>
    @import url("https://fonts.googleapis.com/css?family=Montserrat:300,400,500,700&display=swap");

    *,
    *::before,
    *::after {
        margin: 0;
        padding: 0;
        box-sizing: inherit;
    }

    .button-add-sound {
        background-color: #ffc087;
        border: none;
        border-radius: 5px;
        padding: 10px 20px;
        font-family: Montserrat;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
    }

    .no-sounds {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 200px;
        font-family: Montserrat;
        font-size: 1rem;
        color: #555;
    }

    .no-sounds i {
        margin-top: 10px;
        font-size: 2rem;
        color: #ccc;
    }

    header {
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .page-title {
        font-family: Montserrat;
        font-size: 1.5rem;
        font-weight: bold;
    }

    .search-input {
        margin-left: auto;
        margin-right: 10px;
        padding: 5px;
        font-size: 1rem;
        border-radius: 5px;
        border: 1px solid #ddd;
    }

    .sounds-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 10px;
        background-color: #fff;
        border-radius: 20px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
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
    }

    .panel-button {
        margin: 0 10px;
        background-color: transparent;
        border: none;
        cursor: pointer;
        font-family: Montserrat;
        font-weight: 600;
        font-size: 1rem;
        display: flex;
        align-items: center;
    }

    .panel-button i {
        margin-right: 5px;
    }
</style>
