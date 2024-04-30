<template>
    <aside class="menu" v-show="isMenuVisible">
        <div class="menu-filter">
            <i class="fa fa-search fa-lg"></i>
            <input 
            v-model="treeFilter" 
            type="text" 
            placeholder="Digite para filtrar..."
            class="filter-field"/>
        </div>
        <Tree 
        :data="treeData" 
        :options="treeOptions"
        :filter="treeFilter"
        ref="tree" />
    </aside>
</template>

<script>
import { mapState } from 'vuex'
import { baseApiUrl } from '@/global'
import Tree from 'liquor-tree'
import axios from 'axios'

export default {
    name: 'Menu',
    components: { Tree },
    computed: mapState(['isMenuVisible']),
    data: function(){
        return {
            treeFilter: '',
            treeData: this.getTreeData(),
            treeOptions: {
                propertyNames: {'text': 'name'},
                filter: { emptyText: 'Categoria não encontrada' }
            }
        }
    },
    methods: {
        getTreeData(){
            return axios.get(`${baseApiUrl}/categories/tree`).then(res => res.data)
        },
        onNodeSelect(node){
            this.$router.push({
                name: 'articlesByCategory',
                params: {id: node.id}
            })

            if(this.$mq === 'xs' || this.$mq === 'sm'){
                this.$store.commit('toggleMenu', false)
            }
        }
    },
    mounted(){
        this.$refs.tree.$on('node:selected',this.onNodeSelect)

        if(this.$mq === 'xs' || this.$mq === 'sm'){
            this.$store.commit('toggleMenu', false)
        }
    }
}
</script>

<style>
    .menu{
        grid-area: menu;
        background: #333;

        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
    }

    .menu a,
    .menu a:hover{
        color: white;
        text-decoration: none;
    }

    .menu .tree-node.selected > .tree-content,
    .menu .tree-node .tree-content:hover{
        background-color: #444;
    }

    .menu .tree-arrow.has-child{
        filter: brightness(2);
    }

    .menu .menu-filter{
        display: flex;
        justify-content: center;
        align-items: center;

        padding: 5px 8px;
        border-bottom: 1px solid #444;
    }

    .menu .menu-filter:hover{
        background-color: #444;
    }

    .menu .menu-filter i{
        color: #ccc;
        margin-left: 5px;
    }

    .menu-filter .filter-field{
        flex: 1;
        padding: 5px 10px;
        color: #ccc;
        background: transparent;
        border: none;
    }

    .menu-filter .filter-field:focus{
        outline: none;
    }

    .menu .tree-filter-empty{
        color: #ccc;
        text-align: center;
    }
</style>