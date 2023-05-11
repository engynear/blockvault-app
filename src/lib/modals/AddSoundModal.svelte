<script>
    export let isOpen = true;
    export let onSubmit;
    export let onClose;

    let name = "";
    let description = "";
    let tags = "";
    let soundFile = null;

    function handleSubmit(event) {
        event.preventDefault();

        const newSound = {
            name,
            description,
            tags: tags.split(",").map((tag) => tag.trim()),
        };

        onSubmit(newSound, soundFile);
        handleClose();
    }

    function handleClose() {
        onClose();
        isOpen = false;
        name = "";
        description = "";
        tags = "";
        soundFile = null;
    }

    function handleSoundFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            soundFile = file;
        }
    }
</script>

{#if isOpen}
    <div class="modal">
        <form on:submit|preventDefault={handleSubmit}>
            <label>
                Название:
                <input type="text" bind:value={name} required />
            </label>
            <label>
                Описание:
                <textarea bind:value={description} />
            </label>
            <label>
                Теги (через запятую):
                <input type="text" bind:value={tags} />
            </label>
            <label>
                Файл звука (.wav):
                <input
                    type="file"
                    accept=".wav"
                    on:change={handleSoundFileChange}
                />
            </label>
            <button type="submit">Добавить</button>
        </form>
        <button class="close-modal" on:click={handleClose}>
            <i class="fa fa-times" aria-hidden="true" />
        </button>
    </div>
    <div class="blur" />
{/if}

<style lang="scss">
    .modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
        width: 50%;
        max-width: 900px; // Уменьшаем максимальную ширину до 900px
        background-color: white;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        overflow: auto;
    }

    .modal form {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .modal label {
        display: flex;
        flex-direction: column;
    }

    .modal input,
    .modal textarea {
        padding: 8px;
        border-radius: 4px;
        border: 1px solid #ccc;
        resize: none;
    }

    .modal button {
        cursor: pointer;
        padding: 5px;
        border-radius: 5px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        box-sizing: border-box;
        background-color: #fff;
        transition: all 0.2s ease-in-out;

        &:hover {
            background-color: #eee;
        }
    }

    .modal button.close-modal {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 20px;
        background-color: transparent;
        border: none;
        cursor: pointer;
        color: black;
    }

    .blur {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.25);
        backdrop-filter: blur(5px);
    }
</style>
