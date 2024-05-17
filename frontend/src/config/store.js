import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'
import { menuVisibleKey } from '@/global'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        isMenuVisible: (/true/i).test(localStorage.getItem(menuVisibleKey)),
        user: null
    },
    mutations: {
        toggleMenu(state, isVisible){
            if(!state.user){
                state.isMenuVisible = false
                return
            }

            if(isVisible === undefined){
                state.isMenuVisible = !state.isMenuVisible
            } else {
                state.isMenuVisible = isVisible
            }

            localStorage.setItem(menuVisibleKey, state.isMenuVisible)
        },
        setUser(state, user){
            state.user = user

            if(user){
                axios.defaults.headers.common['Authorization'] = `bearer ${user.token}`
            } else {
                delete axios.defaults.headers.common['Authorization']
            }
        }
    }
})