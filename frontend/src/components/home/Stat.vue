<template>
    <div class="stat">
        <div class="stat-icon">
            <i :class="icon" :style="style"></i>
        </div>
        <div class="stat-info">
            <span class="stat-title">{{ title }}</span>
            <span class="stat-value">{{ value }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Stat',
    props: ['title', 'value', 'icon', 'color'],
    computed: {
        style(){
            return "color: " + (this.color || "#000")
        }
    }
}
</script>

<style>
    .stat{
        flex: 1;
        display: flex;
        border-radius: 8px;
        margin-right: 20px;
        margin-bottom: 20px;
        padding: 20px;

        background-color: white;
        /* border: 1px solid rgba(0, 0, 0, 0.2); */
        box-shadow: 0 2px 5px #3333;
    }

    .stat-icon{
        display: flex;
        align-items: center;
    }

    .stat-icon i{
        font-size: 3rem;
    }

    .stat-info{
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        margin-left: 10px;
    }

    .stat-title{
        font-size: 1.2rem;
    }

    .stat-value{
        font-size: 1.5rem;
    }
</style>