import Vue from 'vue'

import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        uerInfo: {},
        record: {
            foodRecord: false,
            motionRecord: false
        },
    },
    getters: {
        hasLogin: (state, getters) => {
            return state.hasLogin
        },
        userinfo: (state, getters) => {
            return state.uerInfo
        },
    },
    mutations: {
        isLoginBtn(state, provider) {
            // state.hasLogin = true
            state.uerInfo = provider
            uni.setStorage({
                key: 'uerInfo',
                data: provider
            })
        },
        changeRecord(state, provider) {
            if (provider == "food") {
                state.record.foodRecord = true
            } else {
                state.record.motionRecord = true
            }

        },
        updateRecord(state) {
            state.record.foodRecord = false;
            state.record.motionRecord = false;
        }

    },
    actions: {

    },

})
export default store