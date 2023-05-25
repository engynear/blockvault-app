<script>
    import { onMount, onDestroy } from "svelte";
    import { selectedModels, selectedSounds } from "$lib/store.js";
  
    let selectedModelsValue = [];
    let selectedSoundsValue = [];
  
    const apiURL = import.meta.env.VITE_API_URL;
  
    let unsubscribeModels;
    let unsubscribeSounds;
  
    onMount(() => {
      unsubscribeModels = selectedModels.subscribe((value) => {
        selectedModelsValue = value.map((model) => ({
          ...model,
          previewImage: `${apiURL}/models/${model.id}/preview-image`,
        }));
      });
  
      unsubscribeSounds = selectedSounds.subscribe((value) => {
        selectedSoundsValue = value;
      });
  
      console.log("ResourceList mounted");
    });
  
    onDestroy(() => {
      if (unsubscribeModels) {
        unsubscribeModels();
      }
  
      if (unsubscribeSounds) {
        unsubscribeSounds();
      }
    });
  
    function handleCreateResourcepack() {
      const modelData = JSON.stringify(selectedModelsValue);
      const soundData = JSON.stringify(selectedSoundsValue);
      const queryParams = new URLSearchParams({
        models: modelData,
        sounds: soundData,
      }).toString();
  
      window.location.href = `/resourcepacks/new?${queryParams}`;
    }
  
    function removeModel(model) {
      selectedModels.update((models) => {
        return models.filter((m) => m.id !== model.id);
      });
    }
  
    function removeSound(sound) {
      selectedSounds.update((sounds) => {
        return sounds.filter((s) => s.id !== sound.id);
      });
    }
  </script>

<div class="resources-list">
    {#if selectedModelsValue.length > 0}
        <h2>Выбранные модели</h2>
        <div class="model-list-container">
            <ul class="model-list">
                {#each selectedModelsValue as model}
                    <li>
                        <div class="model-card">
                            <div class="preview-image-container">
                                <!-- svelte-ignore a11y-img-redundant-alt -->
                                <img
                                    class="preview-image"
                                    src={model.previewImage}
                                    alt="Preview image"
                                />
                            </div>
                            <div class="model-info">
                                <h3>{model.name}</h3>
                                <p>{model.description}</p>
                            </div>
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <div class="delete-icon" on:click={() => removeModel(model)}>
                                <i class="fa fa-trash"></i>
                            </div>
                        </div>
                    </li>
                {/each}
            </ul>
        </div>
    {/if}

    {#if selectedSoundsValue.length > 0}
        <h2>Выбранные звуки</h2>
        <div class="sound-list-container">
            <ul class="sound-list">
                {#each selectedSoundsValue as sound}
                    <li>
                        <div class="sound-card">
                            <div class="sound-info">
                                <h3>{sound.name}</h3>
                                <p>{sound.description}</p>
                            </div>
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <div class="delete-icon" on:click={() => removeSound(sound)}>
                                <i class="fa fa-trash"></i>
                            </div>
                        </div>
                    </li>
                {/each}
            </ul>
        </div>
    {/if}

    <button class="build-resourcepack-button" disabled={!selectedModelsValue.length && !selectedSoundsValue.length} on:click={handleCreateResourcepack}>
        {#if selectedModelsValue.length > 0 || selectedSoundsValue.length > 0}
            Собрать ресурс-пак
        {:else}
            Выберите модели и звуки
        {/if}
    </button>
</div>

<style>
    .resources-list {
        padding: 16px;
        background-color: #0e0f14;
        border-radius: 20px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        color: white;

        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        margin: 1% 1% 1% 0%;
        display: flex;
        flex-direction: column;
        width: 20vw;
        max-width: 300px;
    }

    .resources-list ul {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .resources-list li {
        padding: 4px 0;
        color: white;
    }

    .resources-list h2 {
        font-size: 1.2rem;
        margin-bottom: 8px;
    }

    .resources-list button.build-resourcepack-button {
        background-color: #ffc087;
        border: none;
        border-radius: 5px;
        padding: 10px 20px;
        font-family: Montserrat;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        width: 100%;
        margin-top: auto;

        transition: background-color 0.2s ease-in-out;
    }

    .resources-list button.build-resourcepack-button:hover {
        background-color: #ff9c5a;
    }

    .model-card {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        background-color: #1f2228;
        border-radius: 8px;
    }

    .preview-image-container {
        width: 25%;
        aspect-ratio: 1/1;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        overflow: hidden;
        background-color: #cccccc;
    }

    .preview-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 10px;
        background-color: #cccccc;
    }

    .model-card .model-info {
        flex: 1;
        color: white;
    }

    .model-card h3 {
        margin: 0;
        font-size: 1.2rem;
    }

    .model-card p {
        margin: 0;
        font-size: 0.9rem;
    }

    .delete-icon {
        width: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: white;
    }

    .delete-icon:hover {
        color: #ff4d4d;
    }

    .model-list-container {
        flex: 1;
        overflow: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    .model-list-container::-webkit-scrollbar {
        display: none;
    }

    .model-list {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .sound-card {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        background-color: #1f2228;
        border-radius: 8px;
    }

    .sound-card .sound-info {
        flex: 1;
        color: white;
    }

    .sound-card h3 {
        margin: 0;
        font-size: 1.2rem;
    }

    .sound-card p {
        margin: 0;
        font-size: 0.9rem;
    }

    .sound-list-container {
        flex: 1;
        overflow: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    .sound-list-container::-webkit-scrollbar {
        display: none;
    }

    .sound-list {
        margin: 0;
        padding: 0;
        list-style: none;
    }
</style>
