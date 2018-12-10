import Vue from "vue";
import Vuex from "vuex";
import _ from "lodash";
import ajax from "./ajax";
import stg from "./stg";
import perm from "./perm";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // dic
    langs: [],
    grades: [],
    subjects: [],
    topics: [],
    sub_topics: [],
    difficulties: [],
    task_types: [],
    attachment_types: [],

    profile: null,

    modal: null,
  },
  getters: {
    phps: (state) => (ids) => {
      return (state.profile && _.find(state.profile.perms, x => (ids.indexOf(x) > -1)));
    },
    php: (state, getters) => (ids) => {
      return getters.phps(_.concat([perm.All], ids));
    },
  },
  mutations: {
    set(state, q) {
      state[q[0]] = q[1];
    },
    alertMsg(state, msg) {
      state.modal = {msg};
    },
    confirm(state, pars) {
      state.modal = {
        hdr: pars.hdr,
        msg: pars.msg,
        buttons: [
          {txt: 'Да', variant: 'success', cb: pars.okCb},
          {txt: 'Отмена', cb: pars.cancelCb},
        ],
      };
    },
    setProfile(state, value) {
      // if (!!state.profile !== !!value) {
      //   if (value) {
      //   } else {
      //   }
      // }
      if (!value) {
        stg.set('auth_token', '');
      }
      state.profile = value;
    },
  },
  actions: {
    refreshProfile({commit}) {
      console.log('refreshProfile');
      return ajax.reqAPI('profile').then(response => {
        commit('setProfile', response.data);
      });
    },
    reloadDic({dispatch}) {
      return Promise.all([
        dispatch('reloadLangs'),
        dispatch('reloadGrades'),
        dispatch('reloadSubjects'),
        dispatch('reloadTopics'),
        dispatch('reloadSubTopics'),
        dispatch('reloadDifficulties'),
        dispatch('reloadTaskTypes'),
        dispatch('reloadAttachmentTypes'),
      ]);
    },
    reloadLangs({commit}) {
      return ajax.reqAPI(`dic/langs`, {without_token: true}).then(response => {
        commit('set', ['langs', response.data]);
      });
    },
    reloadGrades({commit}) {
      return ajax.reqAPI(`dic/grades`, {without_token: true}).then(response => {
        commit('set', ['grades', response.data]);
      });
    },
    reloadSubjects({commit}) {
      return ajax.reqAPI(`dic/subjects`, {without_token: true}).then(response => {
        commit('set', ['subjects', response.data]);
      });
    },
    reloadTopics({commit}) {
      return ajax.reqAPI(`dic/topics`, {without_token: true}).then(response => {
        commit('set', ['topics', response.data]);
      });
    },
    reloadSubTopics({commit}) {
      return ajax.reqAPI(`dic/sub_topics`, {without_token: true}).then(response => {
        commit('set', ['sub_topics', response.data]);
      });
    },
    reloadDifficulties({commit}) {
      return ajax.reqAPI(`dic/difficulties`, {without_token: true}).then(response => {
        commit('set', ['difficulties', response.data]);
      });
    },
    reloadTaskTypes({commit}) {
      return ajax.reqAPI(`dic/task_types`, {without_token: true}).then(response => {
        commit('set', ['task_types', response.data]);
      });
    },
    reloadAttachmentTypes({commit}) {
      return ajax.reqAPI(`dic/attachment_types`, {without_token: true}).then(response => {
        commit('set', ['attachment_types', response.data]);
      });
    },
  },
})
