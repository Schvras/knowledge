<template>
    <div class="articles-by-category">
        <PageTitle  icon="fa fa-folder" :main="category.name" sub="Artigos da categoria" />
        <div class="articles">
            <ArticleItem v-for="article in articles" :key="article.id" :article="article"></ArticleItem>
        </div>
        <div class="load-more">
            <b-button variant="outline-primary" v-if="loadMore" @click="getArticles">Carregar Mais</b-button>
        </div>
    </div>
</template>

<script>
import { baseApiUrl } from '@/global'
import axios from 'axios'
import PageTitle from '../template/PageTitle.vue'
import ArticleItem from '../article/ArticleItem'

export default {
    name: 'ArticlesByCategory',
    components: { PageTitle, ArticleItem },
    props: ['id'],
    data(){
        return {
            category: {},
            articles: [],
            page: 1,
            loadMore: true
        }
    },
    methods: {
        getCategory(){
            const url = `${baseApiUrl}/categories/${this.category.id}`

            axios.get(url).then( res => this.category = res.data)
        },
        getArticles(){
            const url = `${baseApiUrl}/categories/${this.category.id}/articles?page=${this.page}`

            axios.get(url).then( res => {
                this.articles = this.articles.concat(res.data)
                this.page++

                if(res.data.length === 0) this.loadMore = false
            })
        }
    },
    computed: {
        iconUrl () {
            return require('@/assets/article.png')
        }
    },
    watch: {
        $route(to){
            this.category.id = to.params.id
            this.articles = []
            this.page = 1
            this.loadMore = true

            this.getCategory()
            this.getArticles()
        }
    },
    mounted(){
        this.category.id = this.$route.params.id
        this.getCategory()
        this.getArticles()
    }
}
</script>

<style>
    .articles-by-category .articles{
        display: flex;
        flex-direction: column;
    }

    .articles-by-category .load-more{
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 25px;
    }
</style>