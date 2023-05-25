<script>
    import "../app.scss";
    const logoPath = "/favicon.png";
</script>

<div class="sidenav">
    <a href="/">
        <div class="logo">
            <img src={logoPath} alt="Logo" />
            <h3 class="brandname">
                <div class="centered">BlockVault</div>
            </h3>
        </div>
    </a>
    <hr class="separator" />
    <a href="/resources/models">3d модели</a>
    <a href="/resources/sounds">Звуки</a>
    <hr class="separator" />
    <!-- <a href="/maps">Карты</a> -->
    <a href="/resourcepacks">Ресурспаки</a>
</div>

<style lang="scss">
    @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap");
    .sidenav {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        height: inherit;
        margin: 1% 0% 1% 1%;
        border-radius: 20px;
        background-color: #0e0f14;
        width: 20%;
        max-width: 300px;
        z-index: 5;
    }

    .separator {
        opacity: 0.1;
    }

    div.logo {
        display: flex;
        flex-direction: row;
        justify-content: center;
        padding: 10px 10px 10px 10px;
    }

    h3.brandname {
        margin: 0;
        margin-left: 5px;
        color: white;
        font-family: "Montserrat", sans-serif;
        font-size: medium;
        text-align: center;
    }

    .centered {
        display: flex;
        justify-content: center;
        align-items: center;
        /* Выравниваем содержимое по центру по вертикали и горизонтали */
        height: 100%; /* Устанавливаем высоту, чтобы элемент занимал всю доступную высоту */
    }
    a:hover {
        background-color: transparent;
    }
</style>
