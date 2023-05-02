<script>
    import { createEventDispatcher } from 'svelte';
    
    export let visible = false;
    export let onClose;
  
    const dispatch = createEventDispatcher();
  
    let modelName = '';
    let modelFile = null;
    let previewImage = null;
    let tags = '';
  
    async function handleFormSubmit(event) {
        event.preventDefault();
        const formData = new FormData();
        formData.append('modelName', modelName);
        formData.append('modelFile', modelFile);
        formData.append('previewImage', previewImage);
        formData.append('tags', tags);
      
        const response = await fetch("http://127.0.0.1:8080/models", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
        
        } else {
        // error message
        }

        onClose();
    }
  
    function handleModelFileChange(event) {
      modelFile = event.target.files[0];
    }
  
    function handlePreviewImageDrop(event) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        previewImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  </script>
  
  {#if visible}
    <div class="modal-backdrop">
      <div class="modal-content">
        <button on:click={onClose}>&times;</button>
        <h2>Добавить модель</h2>
        <form on:submit={handleFormSubmit}>
          <label>
            Название модели:
            <input type="text" bind:value={modelName} required />
          </label>
          <label>
            Файл модели:
            <input type="file" accept=".glb,.gltf" onchange={handleModelFileChange} required />
          </label>
          <label>
            Теги (через запятую):
            <input type="text" bind:value={tags} />
          </label>
          <div
            class="preview-dropzone"
            on:dragover={(e) => e.preventDefault()}
            on:drop={handlePreviewImageDrop}
          >
            <p>Перетащите сюда картинку-превью или выберите файл</p>
            {#if previewImage}
              <img src={previewImage} alt="Preview" />
            {/if}
          </div>
          <button type="submit">Добавить</button>
        </form>
      </div>
    </div>
  {/if}
  
  <style lang="scss">
    .modal-backdrop {
      display: flex;
      align-items: center;
      justify-content: center;
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(5px);
    }
  
    .modal-content {
      background-color: white;
      position: fixed;
      z-index: 2;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      width: 500px;
      max-width: 100%;
      min-height: 200px;
      max-height: 500px;
      overflow: auto;
      border: 1px solid rgba(0, 0, 0, 0.2);
      box-sizing: border-box;
      padding: 20px
    }

    .modal-content button {
      position: absolute;
      right: 10px;
      top: 10px;
      border: none;
      background: none;
      font-size: 30px;
      cursor: pointer;
      color: rgba(0, 0, 0, 0.5);

        &:hover {
            color: rgba(0, 0, 0, 0.8);
        }
    }

    .modal-content h2 {
      margin-top: 0;
    }

    .modal-content form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .modal-content label {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .modal-content input {
      padding: 5px;
      border-radius: 5px;
      border: 1px solid rgba(0, 0, 0, 0.2);
      box-sizing: border-box;
    }

    .modal-content .preview-dropzone {
      border: 1px dashed rgba(0, 0, 0, 0.2);
      padding: 10px;
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      cursor: pointer;

      img {
        max-width: 100%;
        max-height: 200px;
      }
    }

    .modal-content button[type="submit"] {
      padding: 5px;
      border-radius: 5px;
      border: 1px solid rgba(0, 0, 0, 0.2);
      box-sizing: border-box;
      cursor: pointer;
      background-color: #fff;
      transition: all 0.2s ease-in-out;

      &:hover {
        background-color: #eee;
      }
    }

    :global(body.modal-open) {
        overflow: hidden;
    }

    :global(body.modal-open) .modal-backdrop {
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
    }

    :global(body.modal-open) .modal-content {
        /* Другие стили модального окна */
    }
</style>
    
  