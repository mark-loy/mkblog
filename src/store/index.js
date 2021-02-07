import Vue from 'vue'
import Vuex from 'vuex'
import {
    getTimeInterval
} from '../utils/index'
import siteApi from '@/api/site'
import ucenterApi from '@/api/ucenter'

import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)
// 略:后台获取系统运行时间
const runAt = '1589878800000';
let timer = null;
const state = {
    loading: false,
    runTimeInterval: '',
    socials: '',
    websiteInfo: '',
    token: '',
    visitorInfo: ''
}
const mutations = {
    SET_LOADING: (state, v) => {
        state.loading = v;
    },
    SET_SOCIALS: (state, v) => {
        state.socials = v;
    },
    SET_SITE_INFO: (state, v) => {
        state.websiteInfo = v;
    },
    SET_TOKEN: (state, v) => {
        state.token = v
    },
    SET_VISITOR_INFO: (state, v) => {
        state.visitorInfo = v
    },
    GET_RUNTIME_INTERVAL: (state) => {
        if (!timer || !state.runTimeInterval) {
            clearInterval(timer)
            timer = setInterval(() => {
                state.runTimeInterval = getTimeInterval(runAt);
            }, 1000);
        }
    }
}
const actions = {
    setLoading: ({
        commit
    }, v) => {
        commit('SET_LOADING', v);
    },
    initComputeTime: ({
        commit
    }) => {
        commit('GET_RUNTIME_INTERVAL');
    },
    getSiteInfo: ({
        commit,
        state
    }) => {
        return new Promise(resolve => {
            if (state.websiteInfo) {
                resolve(state.websiteInfo)
            } else {
                // 获取所有的站点信息
                siteApi.selectSiteInfo().then(res => {
                    let data = res.data.siteInfo || {}
                    commit('SET_SITE_INFO', data);
                    resolve(data);
                }).catch(err => {
                    resolve({});
                })
            }
        })
    },
    getSocials: ({
        commit,
        state
    }) => {
        return new Promise((resolve => {
            if (state.socials) {
                resolve(state.socials)
            } else {
                siteApi.selectSocialInfo().then(res => {
                    let data = res.data.socials || []
                    commit('SET_SOCIALS', data);
                    resolve(data);
                }).catch(err => {
                    resolve([]);
                })
            }
        }))
    },
    getVisitor: ({
        commit,
        state
    }) => {
        return new Promise((resolve => {
            if (Object.keys(state.visitorInfo).length > 0) {
                resolve(state.visitorInfo)
            } else {
                ucenterApi.getVisitorInfo().then(res => {
                    // 设置访客信息
                    commit('SET_VISITOR_INFO', res.data)
                    resolve(res.data);
                }).catch(err => {
                    resolve({});
                })
            }
        }))
    }
}
const getters = {
    loading: state => state.loading,
    runTimeInterval: state => state.runTimeInterval,
    notice: state => state.websiteInfo ? state.websiteInfo.notice : '',
    token: state => state.token,
    visitorInfo: state => state.visitorInfo
}
export default new Vuex.Store({
    state,
    mutations,
    actions,
    modules: {},
    getters,
    // 解决刷新vuex状态丢失问题
    plugins: [
        createPersistedState({
            /* 将vuex数据存储到sessionStorage */
            storage: window.sessionStorage
        })
    ]
})