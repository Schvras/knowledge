<template>
    <div class="category-admin">
        <b-form>
            <input type="hidden" id="category-id" v-model="category.id">
            <b-form-group label="Nome" label-for="category-name">
                <b-form-input id="category-name" type="text" v-model="category.name" required placeholder="Informe o nome da categoria..." :readonly="mode === 'remove'"></b-form-input>
            </b-form-group >
            <b-form-group label="Categoria pai" label-for="category-parentId">
                <b-form-select v-if="mode === 'save'" id="category-parentId" v-model="category.parentId" :options="categories.filter(item => category.id !== item.value)"  :readonly="mode === 'remove'"></b-form-select >
                <b-form-input v-else id="category-parentId" type="text" v-model="categories.filter(item => category.parentId === item.value)[0].text" readonly></b-form-input>
            </b-form-group>
            <b-button variant="primary" v-if="mode === 'save'" @click="save">Confirmar</b-button>
            <b-button variant="danger" v-if="mode === 'remove'" @click="remove">Excluir</b-button>
            <b-button class="ml-2" @click="reset">Cancelar</b-button>
        </b-form>
        <hr>
        <b-table hover striped :items="categories.filter(item => item.id)" :fields="fields">
            <template slot="actions" slot-scope="data">
                <b-button variant="warning" @click="loadCategory(data.item,'save')" class="btn-sm mr-2">
                    <i class="fa fa-pencil"></i>
                </b-button>
                <b-button variant="danger" @click="loadCategory(data.item,'remove')" class="btn-sm">
                    <i class="fa fa-trash"></i>
                </b-button>
            </template>
        </b-table>
    </div>
</template>

<script>
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'

export default {
    name: 'CategoryAdmin',
    data: function (){
        return {
            mode: 'save',
            category: {id: null, name: null, parentId: null, path: null},
            categories: [],
            fields: [
                {key: 'id', label: 'Código', sortable: true},
                {key: 'name', label: 'Nome', sortable: true},
                {key: 'path', label: 'Caminho', sortable: true},
                {key: 'actions', label: 'Ações'}
            ]
        }
    },
    methods: {
        loadCategories(){
            const url = `${baseApiUrl}/categories`

            axios.get(url).then(res => {

                this.categories = res.data.map(category => {
                    return { ...category, value: category.id, text: category.path}
                })

                this.categories.unshift({
                    value: null, 
                    text: 'Não definida'
                })
            })
        },
        reset(){
            this.mode = 'save'
            this.category = {id: null, name: null, parentId: null, path: null}
            this.loadCategories()
        },
        save(){
            const method = this.category.id ? 'put' : 'post'
            const id = this.category.id ? `/${this.category.id}` : ''
            const url = `${baseApiUrl}/categories${id}`

            axios[method](url,this.category)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                }).catch(showError)
        },
        remove() {
            const url = `${baseApiUrl}/categories/${this.category.id}`

            axios.delete(url,this.category)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                }).catch(showError)
        },
        loadCategory(category, mode = 'save'){
            this.mode = mode
            this.category = {...category}
        }
    },
    mounted(){
        this.loadCategories()
    }
}
</script>

<style>

</style>