<template>
    <footer class="footer">
        <span>Copyright <strong>Jean Henrique Schvartz</strong> 2022-2024</span>
    </footer>
</template>

<script>
export default {
    name: 'Footer'
}
</script>

<style>
    .footer{
        grid-area: footer;
        background-color: #ddd;
        color: #333;

        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-right: 10px;
    }

    @media screen and (min-width: 480px){
        .footer{
            justify-content: center;
        }
    }
</style>