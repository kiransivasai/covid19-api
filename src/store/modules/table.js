import axios from "axios";
const state = {
  states: {
    AN: "Andaman and Nicobar Islands",
    AP: "Andhra Pradesh",
    AR: "Arunachal Pradesh",
    AS: "Assam",
    BR: "Bihar",
    CH: "Chandigarh",
    CT: "Chhattisgarh",
    DN: "Dadra and Nagar Haveli",
    DD: "Daman and Diu",
    DL: "Delhi",
    GA: "Goa",
    GJ: "Gujarat",
    HR: "Haryana",
    HP: "Himachal Pradesh",
    JK: "Jammu and Kashmir",
    JH: "Jharkhand",
    KA: "Karnataka",
    KL: "Kerala",
    LA: "Ladakh",
    LD: "Lakshadweep",
    MP: "Madhya Pradesh",
    MH: "Maharashtra",
    MN: "Manipur",
    ML: "Meghalaya",
    MZ: "Mizoram",
    NL: "Nagaland",
    OR: "Odisha",
    PY: "Puducherry",
    PB: "Punjab",
    RJ: "Rajasthan",
    SK: "Sikkim",
    TN: "Tamil Nadu",
    TG: "Telangana",
    TR: "Tripura",
    UP: "Uttar Pradesh",
    UT: "Uttarakhand",
    WB: "West Bengal",
  },
  covid_data: [],
  filterStatus: "",
  filterValue: 0,
  filterOperator: "",
};
const mutations = {
  SET_COVID_DATA(state, data) {
    state.covid_data = data;
  },
  UPDATE_FILTER_STATUS(state, data) {
    state.filterStatus = data;
  },
  UPDATE_FILTER_VALUE(state, data) {
    state.filterValue = data;
  },
  UPDATE_FILTER_OPERATOR(state, data) {
    state.filterOperator = data;
  },
};

const actions = {
  getCovidData({ commit }) {
    axios
      .get("https://api.covid19india.org/v4/min/data.min.json")
      .then((res) => {
        const { TT, ...rest } = res.data;
        commit("SET_COVID_DATA", Object.entries(rest));
      });
  },
  updateFilterStatus({ commit }, value) {
    commit("UPDATE_FILTER_STATUS", value);
  },
  updateFilterOperator({ commit }, value) {
    commit("UPDATE_FILTER_OPERATOR", value);
  },
  updateFilterValue({ commit }, value) {
    commit("UPDATE_FILTER_VALUE", value);
  },
};

const getters = {
  covidData: (state) => {
    return state.covid_data;
  },
  getStates: (state) => {
    return state.states;
  },
  getFilterStatus: (state) => {
    return state.filterStatus;
  },
  getFilterOperator: (state) => {
    return state.filterOperator;
  },
  getFilterValue: (state) => {
    return state.filterValue;
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
