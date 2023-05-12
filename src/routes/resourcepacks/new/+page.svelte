<script>
    import { onMount, onDestroy } from "svelte";

    let resourcepackName = "";
    let selectedVersion = "1.19.2";
    let resourcepackDescription = "";

    let selectedModels = [];
    let selectedSounds = [];

    const apiURL = import.meta.env.VITE_API_URL;

    function loadDataFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const modelData = urlParams.get("models");
        const soundData = urlParams.get("sounds");

        if (modelData) {
            selectedModels = JSON.parse(modelData);
            for (let i = 0; i < selectedModels.length; i++) {
                const model = selectedModels[i];
                model.change_type = "item";
                model.change_item = "stick";
                model.custom_model_data = i + 1;
            }
        }

        if (soundData) {
            selectedSounds = JSON.parse(soundData);
            for (let i = 0; i < selectedSounds.length; i++) {
                const sound = selectedSounds[i];
                sound.rp_name = convertToSoundName(sound.name);
            }
        }
    }

    onMount(() => {
        loadDataFromUrl();
    });

    onDestroy(() => {
        selectedModels = [];
        selectedSounds = [];
    });

    const handleCreateResourcepack = async () => {
        try {
            // send model_id, change_type, change_item, custom_model_data
            // send sound_id, rp_name

            const data = {
                name: resourcepackName,
                version: selectedVersion,
                description: resourcepackDescription,
                models: selectedModels.map((model) => ({
                    model_id: model.id,
                    change_type: model.change_type,
                    change_item: model.change_item,
                    custom_model_data: model.custom_model_data
                })),
                sounds: selectedSounds.map((sound) => ({
                    sound_id: sound.id,
                    sound_name: sound.rp_name
                }))
            };

            const response = await fetch(`${apiURL}/resourcepacks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });


            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail);
            }

            const createdResourcepack = await response.json();
            console.log("Resourcepack created:", createdResourcepack);
        } catch (error) {
            console.error("Failed to create resourcepack:", error.message);
        }
    };

    function handleTypeChange(model, event) {
        model.type = event.target.value;
    }

    function handleReplacementChange(model, event) {
        model.change_item = event.target.value;
    }

    function handleCustomModelDataChange(model, event) {
        model.custom_model_data = parseInt(event.target.value) || 0;
    }

    function generateCustomModelData(model) {
        if (selectedModels.length > 0) {
            const customModelDataArray = selectedModels
                .filter((m) => m !== model)
                .map((m) => m.custom_model_data);

            const maxCustomModelData = Math.max(...customModelDataArray);
            model.custom_model_data = maxCustomModelData + 1;
        } else {
            model.custom_model_data = 1;
        }
    }

    function convertToSoundName(str) {
        const cyrillicToLatinMap = {
            а: "a",
            б: "b",
            в: "v",
            г: "g",
            д: "d",
            е: "e",
            ё: "yo",
            ж: "zh",
            з: "z",
            и: "i",
            й: "y",
            к: "k",
            л: "l",
            м: "m",
            н: "n",
            о: "o",
            п: "p",
            р: "r",
            с: "s",
            т: "t",
            у: "u",
            ф: "f",
            х: "h",
            ц: "c",
            ч: "ch",
            ш: "sh",
            щ: "sch",
            ъ: "",
            ы: "y",
            ь: "",
            э: "e",
            ю: "yu",
            я: "ya",
        };

        str = str.toLowerCase();

        str = str.replace(/[а-яё]/g, (match) => {
            return cyrillicToLatinMap[match] || match;
        });

        str = str.replace(/[^a-z0-9]/g, "_");

        str = str.replace(/_+/g, "_");

        str = str.replace(/^_|_$/g, "");

        return str;
    }
</script>

<svelte:head>
    <title>Создание пакета ресурсов</title>
</svelte:head>

<header>
    <h1 class="page-title">Создание пакета ресурсов</h1>

    <button class="create-button" on:click={handleCreateResourcepack}>
        Создать
    </button>
</header>

<div class="header-container">
    <div class="input-row">
        <label for="resourcepack-name">Имя ресурспака:</label>
        <input
            type="text"
            id="resourcepack-name"
            placeholder="Введите имя ресурспака"
            bind:value={resourcepackName}
            class="input-field"
        />
    </div>
    <div class="input-row">
        <label for="version-select">Версия:</label>
        <select id="version-select" bind:value={selectedVersion} class="input-field">
            <option value="1.19.2">1.19.2</option>
            <option value="1.16.5">1.16.5</option>
        </select>
    </div>
    <div class="input-row">
        <label for="description-textarea">Описание:</label>
        <textarea
            id="description-textarea"
            rows="3"
            placeholder="Введите описание ресурспака"
            bind:value={resourcepackDescription}
            class="input-field"
        ></textarea>
    </div>
</div>



{#if selectedModels.length === 0 && selectedSounds.length === 0}
    <div class="no-resources">
        <p>Нет выбранных ресурсов</p>
        <i class="fa fa-exclamation-circle" />
    </div>
{:else}
    <div class="resourcepacks-new">
        <h2>Модели:</h2>
        <ul>
            {#each selectedModels as model}
                <li>
                    <div class="card model-card">
                        <div class="preview-image-container">
                            <img class="preview-image" src={model.previewImage} alt="Preview image" />
                        </div>
                        <div class="card-content model-info">
                            <h3>{model.name}</h3>
                            <p>{model.description}</p>
                            <div class="input-row">
                                <label>Type:</label>
                                <select value={model.change_type} on:change={(event) => handleTypeChange(model, event)}>
                                    <option value="block">Block</option>
                                    <option value="item">Item</option>
                                </select>
                            </div>
                            <div class="input-row">
                                <label>Replacement:</label>
                                <input type="text" value={model.change_item} on:input={(event) => handleReplacementChange(model, event)} />
                            </div>
                            <div class="input-row">
                                <label>custom_model_data:</label>
                                <input type="number" value={model.custom_model_data} on:input={(event) => handleCustomModelDataChange(model, event)} />
                            </div>
                        </div>
                    </div>
                </li>
            {/each}
        </ul>
        <h2>Звуки:</h2>
        <ul>
            {#each selectedSounds as sound}
                <li>
                    <div class="card sound-card">
                        <div class="card-content sound-info">
                            <h3>{sound.name}</h3>
                            <div class="input-row">
                                <label>Имя в ресурспаке:</label>
                                <input type="text" value={sound.rp_name} on:input={(event) => { sound.rp_name = event.target.value; }} />
                            </div>
                        </div>
                    </div>
                </li>
            {/each}
        </ul>
    </div>
{/if}

<style>
    .resourcepacks-new {
        background-color: #f6f8fa;
        border-radius: 20px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        color: #333;
        margin: 0 auto;
        padding: 20px;
    }

    .resourcepacks-new h2 {
        font-size: 1.2rem;
        margin-bottom: 8px;
    }

    .resourcepacks-new ul {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .resourcepacks-new li {
        padding: 4px 0;
    }

    .card {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        background-color: #fff;
        border-radius: 8px;
    }

    .preview-image-container {
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        overflow: hidden;
        background-color: #d1d1d1;
    }

    .preview-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 10px;
    }

    .card-content {
        flex: 1;
        color: #333;
    }

    .card-content h3 {
        margin: 0;
        font-size: 1.2rem;
    }

    .card-content p {
        margin: 0;
        font-size: 0.9rem;
    }

    .input-row {
        display: flex;
        align-items: center;
        margin-top: 4px;
    }

    label {
        margin-right: 4px;
    }

    select,
    input[type="text"],
    input[type="number"] {
        padding: 4px;
        border-radius: 4px;
        border: 1px solid #ddd;
    }

    header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        background-color: #f6f8fa;
        border-radius: 20px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        margin-bottom: 16px;
    }

    .page-title {
        margin: 0;
        font-size: 1.5rem;
        color: #333;
    }

    .create-button {
        background-color: #ffc087;
        border: none;
        border-radius: 5px;
        padding: 10px 20px;
        font-family: Montserrat;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
    }

    .no-resources {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 200px;
        font-family: Montserrat;
        font-size: 1rem;
        color: #555;
        background-color: #f6f8fa;
        border-radius: 20px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    }

    .no-resources i {
        margin-top: 10px;
        font-size: 2rem;
        color: #ccc;
    }

    .header-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        padding: 16px;
        background-color: #f6f8fa;
        border-radius: 20px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        margin-bottom: 16px;
        gap: 10px;
    }

    .input-row {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    label {
        margin-right: 4px;
        font-size: 0.9rem;
    }

    .input-field {
        padding: 4px;
        border-radius: 4px;
        border: 1px solid #ddd;
    }

    textarea {
        width: 100%;
        padding: 4px;
        border-radius: 4px;
        border: 1px solid #ddd;
        resize: none;
        font-family: Montserrat;
        font-size: 1rem;
    }
</style>
