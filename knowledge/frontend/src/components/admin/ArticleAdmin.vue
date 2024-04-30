<template>
    <div class="article-admin">
        <b-form>
            <input type="hidden" id="article-id" v-model="article.id">
            <b-form-group label="Nome" label-for="article-name">
                <b-form-input id="article-name" type="text" v-model="article.name" required placeholder="Informe o nome do artigo..." :readonly="mode === 'remove'"></b-form-input>
            </b-form-group >
            <b-form-group label="Descrição" label-for="article-description">
                <b-form-input id="article-description" type="text" v-model="article.description" required placeholder="Informe a descrição do artigo..." :readonly="mode === 'remove'"></b-form-input>
            </b-form-group >
            <b-form-group v-if="mode === 'save'" label="Imagem [URL]" label-for="article-imageUrl">
                <b-form-input id="article-imageUrl" type="text" v-model="article.imageUrl" required placeholder="Informe a imagem do artigo..." :readonly="mode === 'remove'"></b-form-input>
            </b-form-group >
            <b-form-group label="Categoria" label-for="article-categoryId">
                <b-form-select v-if="mode === 'save'" id="category-parentId" v-model="article.categoryId" :options="categories"></b-form-select>
                <b-form-input v-else id="category-parentId" type="text" v-model="categories.filter(item => item.value === article.categoryId)[0].text" readonly></b-form-input>
            </b-form-group>
            <b-form-group label="Autor" label-for="article-authorId">
                <b-form-select v-if="mode === 'save'" id="category-userId" v-model="article.userId" :options="users"></b-form-select >
                <b-form-input v-else id="category-userId" type="text" v-model="users.filter(item => item.value === article.userId)[0].text" readonly></b-form-input>
            </b-form-group>
            <b-form-group v-if="mode === 'save'" label="Conteúdo" label-for="article-content">
                <VueEditor v-model="article.content" placeholder="Informe o conteúdo..."></VueEditor>
            </b-form-group >
            <b-row>
                <b-col xs="12">
                    <b-button variant="primary" v-if="mode === 'save'" @click="save">Confirmar</b-button>
                    <b-button variant="danger" v-if="mode === 'remove'" @click="remove">Excluir</b-button>
                    <b-button class="ml-2" @click="reset">Cancelar</b-button>
                </b-col>
            </b-row>
        </b-form>
        <hr>
        <b-table id="table-articles" hover striped :items="articles" :fields="fields">
            <template slot="actions" slot-scope="data">
                <b-button variant="warning" @click="loadArticle(data.item,'save')" class="btn-sm mr-2">
                    <i class="fa fa-pencil"></i>
                </b-button>
                <b-button variant="danger" @click="loadArticle(data.item,'remove')" class="btn-sm">
                    <i class="fa fa-trash"></i>
                </b-button>
            </template>
        </b-table>
        <b-pagination
            size="md"
            v-model="page"
            :total-rows="count"
            :per-page="limit"
            aria-controls="table-articles"
            >
        </b-pagination>
    </div>
</template>

<script>
import 'highlightjs/styles/dracula.css'
import hljs from 'highlightjs/highlight.pack'
import { VueEditor } from 'vue2-editor'
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'

export default {
    name: 'ArticleAdmin',
    components: { VueEditor },
    data: function (){
        return {
            mode: 'save',
            article: {id: null, name: null, imageUrl: null, content: null, categoryId: null, userId: null},
            articles: [],
            categories: [],
            users:[],
            page: 1,
            limit: 0,
            count: 0,
            fields: [
                {key: 'id', label: 'Código', sortable: true},
                {key: 'name', label: 'Nome', sortable: true},
                {key: 'description', label: 'Descrição', sortable: true},
                {key: 'actions', label: 'Ações'}
            ]
        }
    },
    methods: {
        loadArticles(){
            axios.get(`${baseApiUrl}/articles?page=${this.page}`)
                .then(res => {
                    this.articles = res.data.data
                    this.count = res.data.count
                    this.limit = res.data.limit
                })
        },
        loadCategories(){
            axios.get(`${baseApiUrl}/categories`)
                .then(res => {
                    this.categories = res.data.map(category => {
                        return {value: category.id, text: category.path}
                    })

                    this.categories.unshift({
                        value: null, 
                        text: 'Não definida'
                    })
                })
        },
        loadUsers(){
            axios.get(`${baseApiUrl}/users`)
                .then(res => {
                    this.users = res.data.map(user => {
                        return {value: user.id, text: user.name}
                    })

                    this.users.unshift({
                        value: null, 
                        text: 'Não definido'
                    })
                })
        },
        reset(){
            this.mode = 'save'
            this.article = {id: null, name: null, imageUrl: null, content: null, categoryId: null, userId: null}
            this.loadArticles()
        },
        save(){
            const method = this.article.id ? 'put' : 'post'
            const id = this.article.id ? `/${this.article.id}` : ''

            const url = `${baseApiUrl}/articles${id}`

            axios[method](url,this.article)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(e => showError(e))
        },
        remove() {
            axios.delete(`${baseApiUrl}/articles/${this.article.id}`,this.article)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        loadArticle(article, mode = 'save'){
            this.mode = mode

            axios.get(`${baseApiUrl}/articles/${article.id}`)
                .then(res => this.article = res.data)
                .catch(e => this.$toasted.global.defaultError(e))
        }
    },
    watch: {
        page(){
            this.loadArticles()
        }
    },
    mounted(){
        this.loadArticles()
        this.loadCategories()
        this.loadUsers()
    },
    updated(){
        document.querySelectorAll('.article-admin pre').forEach( e => {
            hljs.highlightBlock(e)
        })
    }
}
</script>

<style>

</style>