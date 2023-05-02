<script>
  import ModelCard from "$lib/ModelCard.svelte";
  import AddModelModal from "$lib/AddModelModal.svelte";
  import { onMount } from 'svelte';

  let models = [];
  let isModalOpen = false;

  onMount(async () => {
    const response = await fetch('/api/models');
    models = await response.json();
  });

  function openModal() {
    isModalOpen = true;
  }
</script>

<svelte:head>
  <title>3D Models</title>
</svelte:head>

<header>
  <h1 class="page-title">3D Models</h1>
  <button class="button-add-model" on:click={openModal}>Добавить</button>
</header>

<div class="models-grid">
  {#each models as model}
    <ModelCard 
      id={model.id}
      name={model.name} 
      previewImage={`http://localhost:8080/${model.preview_path}`} 
      modelType={model.type} 
      modelTags={model.tags} 
    />
  {/each}
</div>

<AddModelModal visible={isModalOpen} onClose={() => { isModalOpen = false; }} />

<style>
  @import url('https://fonts.googleapis.com/css?family=Montserrat:300,400,500,700&display=swap');

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
