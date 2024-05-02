<template>
    <div class="auth-content">
        <div class="auth-modal">
            <img src="@/assets/logo.png" alt="Logo" width="100%">
            <hr>
            <div class="auth-title">{{ showSignup ? 'Cadastro' : 'Login' }}</div>

            <input name="name" v-if="showSignup" type="text" v-model="user.name" placeholder="Nome" required>
            <input name="email" type="email" v-model="user.email" placeholder="E-mail" required>
            <input name="password" type="password" v-model="user.password" placeholder="Senha" required>
            <input name="confirm-password" v-if="showSignup" type="password" v-model="user.confirmPassword" placeholder="Confirme a senha" required>

            <button v-if="showSignup" @click="signUp">Registrar</button>
            <button v-else @click="signIn">Logar</button>

            <a href @click.prevent="showSignup = !showSignup">
                <span v-if="showSignup">Acessar login !</span>
                <span v-else>Registrar-se aqui !</span>
            </a>
        </div>
    </div>
</template>

<script>
import { baseApiUrl, showError, userKey } from '@/global'
import axios from 'axios'

export default {
    name: 'Auth',
    data: function(){
        return {
            showSignup: false,
            user: {}
        }
    },
    methods: {
        signIn(){
            axios.post(`${baseApiUrl}/signin`, this.user)
                .then(res => {
                    this.$store.commit('setUser', res.data)
                    localStorage.setItem(userKey, JSON.stringify(res.data))
                    this.$router.push({ path: '/'})
                }).catch(e => {
                    showError(e)
                })
        },
        signUp(){
            axios.post(`${baseApiUrl}/signup`, this.user)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.user = {}
                    this.showSignup = false
                }).catch( e => showError(e))
        }
    }

}
</script>

<style>
    .auth-content{
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .auth-modal{
        background-color: #fff;
        width: 350px;
        padding: 35px;
        border-radius: 8px;
        border: 1px solid rgba(0,0,0,0.2);
        box-shadow: 0 1px 5px rgba(0,0,0,0.15);

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .auth-modal hr{
        border: 0;
        width: 100%;
        height: 1px;
        background-image: linear-gradient(to right, rgba(120,120,120, 0), rgba(120,120,120, 0.75), rgba(120,120,120, 0));
    }

    .auth-title{
        font-size: 1.2rem;
        font-weight: 100;
        margin-bottom: 15px;
    }

    .auth-modal input {
        border: 1px solid #bbb;
        width: 100%;
        margin-bottom: 15px;
        padding: 3px 8px;
        border-radius: 4px;
        outline: none;
        background: #eee;
    }

    .auth-modal input:not(:placeholder-shown){
        background: #fff;
    }

    .auth-modal input:focus{
        background: #fff;
    }

    .auth-modal button{
        width: 100%;
        background-color: #2460ae;
        color: white;
        padding: 5px 15px;
        border: none;
        border-radius: 4px;
    }

    .auth-modal a {
        margin-top: 35px;
    }
</style>