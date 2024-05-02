<template>
    <div class="article-by-id">
        <PageTitle icon="fa fa-file-o" :main="article.name" :sub="article.description"></PageTitle>
        <div class="article-content" v-html="article.content"></div>
    </div>
</template>

<script>
import 'highlightjs/styles/magula.css'
import hljs from 'highlightjs/highlight.pack'
import { baseApiUrl } from '@/global'
import axios from 'axios'
import PageTitle from '../template/PageTitle.vue'

export default {
    name: 'ArticleById',
    components: { PageTitle },
    data(){
        return {
            article: {}
        }
    },
    mounted(){
        axios.get(`${baseApiUrl}/articles/${this.$route.params.id}`)
            .then(res => this.article = res.data)
    },
    updated(){
        document.querySelectorAll('.article-content pre').forEach( e => {
            hljs.highlightBlock(e)
        })
    }
}
</script>

<style>
    .article-content{
        background-color: white;
        border-radius: 8px;
        padding: 25px;
        box-shadow: 0 2px 5px #3333;
        border: 1px solid rgba(0,0,0,0.2);
    }

    .article-content pre{
        padding: 20px;
        border-radius: 8px;
    }

    .article-content img{
        max-width: 100%;
    }

    .article-content :last-child{
        margin-bottom: 0;
    }
</style>