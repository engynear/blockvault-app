<script>
    import { onMount, onDestroy } from "svelte";
    const apiURL = import.meta.env.VITE_API_URL;

    export let sound;
    export let isSelected = false;
    export let handleSelection;

    let audio;
    let isPlaying = false;
    let isSoundAvailable = true;

    onMount(async () => {
        try {
            const response = await fetch(`${apiURL}/sounds/${sound.id}/clip`);
            if (response.ok) {
                audio = new Audio(response.url);
                audio.addEventListener("ended", () => {
                    isPlaying = false;
                });
            } else {
                console.error("Sound clip not available in the API.");
                isSoundAvailable = false;
            }
        } catch (error) {
            console.error("Error fetching sound clip:", error);
            isSoundAvailable = false;
        }
    });

    onDestroy(() => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    });

    function playSound() {
        if (!isPlaying && audio) {
            audio.currentTime = 0;
            audio.play();
            isPlaying = true;
        } else if (isPlaying && audio) {
            audio.pause();
            isPlaying = false;
        }
    }

    function onCardClick() {
        window.location.href = `/sounds/${sound.id}`;
    }
</script>

<div
    class="card-container {isSelected ? 'selected' : ''} {isSoundAvailable ? 'sound-available' : 'sound-unavailable'}"
>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
        class="play-button {isPlaying ? 'playing' : ''}"
        on:click={isSoundAvailable && playSound}
        style="margin-left: 10px;"
    >
        {#if isSoundAvailable}
            <i class="fa {isPlaying ? 'fa-pause' : 'fa-play'}"></i>
        {:else}
            <i class="fa fa-ban"></i>
        {/if}
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="card-content">
        <div class="info-container" on:click={onCardClick}>
            <div class="title-description">
                <h2 class="card-title">{sound.name}</h2>
                <p class="card-subtitle">{sound.description}</p>
            </div>
            {#if sound.tags}
                <div class="card-tags">
                    {#each sound.tags as tag}
                        <span class="card-tag">{tag}</span>
                    {/each}
                </div>
            {/if}
        </div>
        {#if isSoundAvailable}
            <input
                type="checkbox"
                id="checkbox-input"
                bind:checked={isSelected}
                on:change={handleSelection(sound, isSelected)}
            />
        {/if}
    </div>
</div>

<style lang="scss">
    .card-container {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
        background-color: #fff;
        transition: background-color 0.3s ease;
        border-radius: 10px;
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
        justify-content: flex-start;
        width: 100%;
        margin-bottom: 5px;
    }

    .info-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        width: 100%;
        cursor: pointer;
    }

    .title-description {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-start;
        gap: 5px;
    }

    .card-title {
        font-size: 1rem;
        font-weight: bold;
    }

    .card-subtitle {
        color: #4d6163;
        font-size: 0.8rem;
    }

    .card-tags {
        margin-top: 5px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 5px;
    }

    .card-tag {
        font-size: 0.8rem;
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
        margin-right: 10px;
    }

    .play-button {
        border: none;
        background-color: transparent;
        color: #4d6163;
        font-size: 2rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.3s ease;
    }

    .play-button.playing {
        color: #ff5b5b;
    }

    .fa {
        font-size: 2rem;
    }

    .sound-unavailable {
        cursor: default;
    }

    .sound-unavailable .play-button:hover {
        color: #4d6163;
    }
</style>
