<script>
    export let data;
    const { model } = data;
</script>

<div class="model-container">
    <!-- svelte-ignore a11y-img-redundant-alt -->
    <img
        class="preview-image"
        src={`http://localhost:8080/${model.preview_path}`}
        alt="Preview image"
    />
    <div class="model-content">
        <h1 class="model-title">{model.name}</h1>
        <p class="model-type">{model.type}</p>
        <!-- <p class="model-format">${model.format}</p> -->
        <!-- <p class="model-description">${model.description}</p> -->
        {#each model.tags as tag}
            <p class="model-tag">{tag}</p>
        {/each}
    </div>
</div>

<style>
    .model-container {
        display: flex;
        align-items: center;
        justify-content: start;
    }

    .preview-image {
        width: 50%; /* займет левые 50% */
        object-fit: cover;
        border-radius: 10px;
    }

    .model-content {
        margin-left: 20px; /* отступ между картинкой и контентом */
        width: 50%; /* займет правые 50% */
    }
    .model-title {
        font-size: 2rem;
        font-weight: bold;
        margin-top: 0;
        margin-bottom: 10px;
    }

    .model-type {
        margin-top: 0;
        margin-bottom: 5px;
        color: #4d6163;
    }

    .model-tag {
        font-size: 0.8rem;
        margin-bottom: 0;
        margin-right: 5px;
        background-color: #ffc087;
        border-radius: 5px;
        padding: 2px;
        text-align: center;
        display: inline-block;
    }
</style>
