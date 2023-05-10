<script>
    import ModelCard from "$lib/resource-cards/ModelCard.svelte";
    import AddModelModal from "$lib/modals/AddModelModal.svelte";
    import { onMount } from "svelte";

    const apiURL = import.meta.env.VITE_API_URL;

    let models = [];

    onMount(async () => {
        await loadModels();
    });

    const loadModels = async () => {
        const response = await fetch(`${apiURL}/models`);
        response.json().then((data) => {
            models = data;
        });
    };

    let isAddingModel = false;
    async function handleAddModel(modelData, projectFile, previewImage) {
        const addModel = await fetch(`${apiURL}/models`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(modelData),
        });

        if (!addModel.ok) {
            console.error("Ошибка при добавлении модели");
            return;
        }

        const newModel = await addModel.json();

        const formUploadProjectFile = new FormData();
        formUploadProjectFile.set("file", projectFile);
        const uploadProjectFile = await fetch(
            `${apiURL}/models/${newModel.id}/project`,
            {
                method: "POST",
                body: formUploadProjectFile,
            }
        );

        if (!uploadProjectFile.ok) {
            console.error("Ошибка при загрузке файла проекта на сервер");
            return;
        }

        const formUploadPreviewImage = new FormData();
        formUploadPreviewImage.set("file", previewImage);
        const uploadPreviewImage = await fetch(
            `${apiURL}/models/${newModel.id}/preview-image`,
            {
                method: "POST",
                body: formUploadPreviewImage,
            }
        );

        if (!uploadPreviewImage.ok) {
            console.error("Ошибка при загрузке картинки-превью на сервер");
            return;
        }

        models.push(newModel);
        models = models;
        isAddingModel = false;
    }
</script>

<svelte:head>
    <title>3D Модели</title>
</svelte:head>

<header>
    <h1 class="page-title">3D Модели</h1>
    <button class="button-add-model" on:click={() => (isAddingModel = true)}>
        Добавить
    </button>
</header>

<div class="models-grid">
    {#each models as model}
        <ModelCard
            id={model.id}
            name={model.name}
            previewImage={`${apiURL}/models/${model.id}/preview-image`}
            modelType={model.type}
            modelTags={model.tags}
            handleSelection={(event) => console.log(event)}
        />
    {/each}
</div>

<AddModelModal
    isOpen={isAddingModel}
    onSubmit={handleAddModel}
    onClose={() => (isAddingModel = false)}
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

    .button-add-model {
        background-color: #ffc087;
        border: none;
        border-radius: 5px;
        padding: 10px 20px;
        font-family: Montserrat;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
    }

    header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .page-title {
        margin-bottom: 20px;
        font-family: Montserrat;
        text-align: center;
    }

    .models-grid {
        padding: 10px;
        background-color: #fff;
        border-radius: 20px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        grid-gap: 16px;
        overflow-y: auto;
    }

    @media (max-width: 480px) {
        .models-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
