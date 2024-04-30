<template>
    <div class="page-title">
        <h1><i v-if="icon" :class="icon"></i> {{ main }}</h1>
        <h2>{{ sub }}</h2>
    </div>
</template>

<script>
export default {
    name: 'PageTitle',
    props: ['icon', 'main', 'sub']
}
</script>

<style>
    .page-title{
        padding: 5px 20px;
        background-color: white;
        border-radius: 8px;
        margin-bottom: 20px;
        box-shadow: 0 2px 5px #3333;
    }

    .page-title h1{
        margin: 0;
        font-size: 1.3rem;
    }

    .page-title h2{
        color: #777;
        margin-top: 5px;
        font-size: 1rem;
        margin-bottom: 0px;
    }
</style>