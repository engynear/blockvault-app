<script>
    import { onMount } from "svelte";
    const apiURL = import.meta.env.VITE_API_URL;

    export let resourcepack;
    export let isSelected = false;
    export let handleSelection;

    function onCardClick() {
        window.location.href = `/resourcepacks/${resourcepack.id}`;
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
            src={`${apiURL}/resourcepacks/${resourcepack.id}/preview-image`}
            alt="Preview image"
            on:click={onCardClick}
            on:keypress={onCardClick}
        />
    </div>
    <div class="card-content">
        <div class="card-description">
            <h2 class="card-title">{resourcepack.name}</h2>
            <p class="card-version">{resourcepack.version}</p>
            {#if resourcepack.description}
                <p class="card-description-text">{resourcepack.description}</p>
            {/if}
        </div>
        <input
            type="checkbox"
            id="checkbox-input"
            bind:checked={isSelected}
            on:change={handleSelection(resourcepack, isSelected)}
        />
    </div>
</div>

<style lang="scss">
    /* Стили для карточки ресурс-пака */

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

    .card-title {
        font-size: 1rem;
        font-weight: bold;
        margin-bottom: 0;
        margin-top: 0;
    }

    .card-version {
        font-size: 14px;
        color: #777;
        margin-bottom: 0;
    }

    .card-description-text {
        font-size: 14px;
        line-height: 1.5;
        margin-bottom: 0;
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
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 10px;

        &:hover {
            cursor: pointer;
        }
    }
</style>
