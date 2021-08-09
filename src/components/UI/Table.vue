<template>
  <div class="tableData">
    <table>
      <tr>
        <th>Sno</th>
        <th>State</th>
        <th @click="sortBy('tested')">Tested &udarr;</th>
        <th @click="sortBy('confirmed')">Confirmed &udarr;</th>
        <th @click="sortBy('deceased')">Deceased &udarr;</th>
        <th @click="sortBy('recovered')">Recovered &udarr;</th>
        <th @click="sortBy('vaccinated1')">Vaccinated &udarr;</th>
      </tr>
      <tr v-for="([scode, sdata], index) in filteredTableData" :key="scode">
        <td>{{ currentPage * 10 - perPage + index + 1 }}</td>
        <td>{{ states[scode] }}</td>
        <td>{{ sdata.total.tested }}</td>
        <td>{{ sdata.total.confirmed }}</td>
        <td>{{ sdata.total.deceased }}</td>
        <td>{{ sdata.total.recovered }}</td>
        <td>{{ sdata.total.vaccinated1 }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: ["filteredTableData", "currentPage", "perPage"],
  methods: {
    sortBy(s) {
      this.$emit("sortBy", s);
    },
  },
  computed: {
    ...mapGetters({ states: "getStates" }),
  },
};
</script>

<style></style>
