<script>
    import { onMount } from "svelte";
    const apiURL = import.meta.env.VITE_API_URL;

    export let model;
    export let isSelected = false;
    export let handleSelection;

    function onCardClick() {
        window.location.href = `/models/${id}`;
    }
</script>

<link
    href="https://cdn.materialdesignicons.com/3.8.95/css/materialdesignicons.min.css"
    rel="stylesheet"
/>

<div class="card-container {isSelected ? 'selected' : ''}">
    <!-- svelte-ignore a11y-img-redundant-alt -->
    <div class="preview-image-container">
        <img
        class="preview-image"
        src={`${apiURL}/models/${model.id}/preview-image`}
        alt="Preview image"
        on:click={onCardClick}
        on:keypress={onCardClick}
        />
    </div>
    <div class="card-content">
        <div class="card-description">
            <h2 class="card-title">{model.name}</h2>
            {#if model.type}
                <p class="card-type">
                    <span class="mdi mdi-file-outline" />
                    {model.type}
                </p>
            {/if}
            {#if model.tags}
                <div class="card-tags">
                    {#each model.tags as tag}
                        <span class="card-tag">{tag}</span>
                    {/each}
                </div>
            {/if}
        </div>
        <input
            type="checkbox"
            id="checkbox-input"
            bind:checked={isSelected}
            on:change={handleSelection(model, isSelected)}
        />
    </div>
</div>

<style lang="scss">
    .card-container {
        border-radius: 10px;
        margin: 0;

        background-color: #fff;
        transition: background-color 0.3s ease;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: start;
    }

    .card-container.selected {
        // border: #4d6163 2px solid;
        outline-color: #4d6163;
        outline-width: 2px;
        outline-style: solid;
    }

    .card-container:hover {
        background-color: #f2f2f2;
    }

    .card-content {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: start;
        gap: 10px;
        width: 100%;
        margin-bottom: 5px;
    }

    .card-description {
        margin-top: 10px;
        margin-left: 5px;
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;
        gap: 5px;
        width: 100%;
    }

    .card-type {
        margin-top: 0;
        margin-bottom: 0;
        color: #4d6163;
    }

    .card-title {
        font-size: 1rem;
        font-weight: bold;
        margin-bottom: 0;
        margin-top: 0;
    }

    .card-tags {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 5px;
    }

    .card-tag {
        font-size: 0.8rem;
        margin-bottom: 0;
        margin-top: 0;
        background-color: #ffc087;
        border-radius: 5px;
        padding: 2px;
        text-align: center;
    }

    #checkbox-input {
        position: relative;
        width: 25px;
        height: 25px;
        border: 2px solid #ccc;
        border-radius: 4px;
        margin: 5px;
        margin-left: auto;
    }

    .preview-image-container {
        width: 100%;
        aspect-ratio: 1/1;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        overflow: hidden;
        background-color: #ccc;
    }

    .preview-image {
        max-width: 100%;
        max-height: 100%;
        object-fit: cover;
        border-radius: 10px;

        &:hover {
            cursor: pointer;
        }
    }
</style>
