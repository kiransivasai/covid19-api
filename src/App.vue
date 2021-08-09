<template>
  <div id="app">
    <h1>Covid 19 Data</h1>
    <div class="filter-row">
      <div class="filter-states">
        <Multiselect
          :multiple="true"
          v-model="selectedStates"
          :options="Object.values(states)"
          placeholder="Select states"
          :close-on-select="true"
          :taggable="true"
          :limit="3"
          :limit-text="limitText"
        />
      </div>
      <FilterData />
    </div>

    <div class="tableData">
      <Table
        @sortBy="sortBy"
        :perPage="perPage"
        :currentPage="currentPage"
        :filteredTableData="filteredTableData"
      />
    </div>

    <div class="pagination">
      <button @click="prevPage">Previous</button>
      <button v-for="page in totalPages" @click="gotoPage(page)" :key="page">
        {{ page }}
      </button>
      <button @click="nextPage">Next</button>
    </div>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import { mapGetters, mapActions } from "vuex";
import Table from "./components/UI/Table.vue";
import FilterData from "./components/UI/FilterData.vue";

export default {
  name: "app",
  components: { Multiselect, Table, FilterData },
  data() {
    return {
      loading: false,
      pages: [],
      currentPage: 1,
      perPage: 10,
      currentSort: "name",
      currentSortDir: "asc",
      selectedStates: [],
    };
  },

  mounted() {
    this.isLoading = true;
    this.getCovidData();
    this.isLoading = false;
  },
  methods: {
    ...mapActions({ getCovidData: "getCovidData" }),
    limitText(count) {
      return `and ${count} other countries`;
    },
    sortBy(s) {
      if (s === this.currentSort) {
        this.currentSortDir = this.currentSortDir === "asc" ? "desc" : "asc";
      }
      this.currentSort = s;
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage * this.perPage < this.covid_data.length) {
        this.currentPage++;
      }
    },
    gotoPage(num) {
      this.currentPage = num;
    },
  },
  computed: {
    ...mapGetters({
      covid_data: "covidData",
      states: "getStates",
      filterValue: "getFilterValue",
      filterStatus: "getFilterStatus",
      filterOperator: "getFilterOperator",
    }),
    totalPages() {
      return Math.ceil(this.covid_data.length / this.perPage);
    },
    filteredTableData() {
      const new_data = this.covid_data
        .filter((row, index) => {
          if (
            this.selectedStates.includes(this.states[row[0]]) ||
            this.selectedStates.length === 0
          ) {
            return true;
          }
        })
        .filter((row, index) => {
          if (
            this.filterStatus === "" ||
            this.filterOperator === "" ||
            !this.filterValue
          ) {
            return true;
          }
          if (this.filterStatus !== "" && this.filterOperator !== "") {
            if (
              this.filterOperator === ">" &&
              row[1].total[this.filterStatus] > this.filterValue
            ) {
              return true;
            } else if (
              this.filterOperator === "<" &&
              row[1].total[this.filterStatus] < this.filterValue
            ) {
              return true;
            } else if (
              this.filterOperator === "=" &&
              row[1].total[this.filterStatus] === this.filterValue
            ) {
              return true;
            }
          }
        })
        .filter((row, index) => {
          let start = (this.currentPage - 1) * this.perPage;
          let end = this.currentPage * this.perPage;
          if (index >= start && index < end) return true;
        })
        .sort((a, b) => {
          let modifier = 1;
          if (this.currentSortDir === "desc") modifier = -1;
          if (a[1].total[this.currentSort] < b[1].total[this.currentSort])
            return -1 * modifier;
          if (a[1].total[this.currentSort] > b[1].total[this.currentSort])
            return 1 * modifier;
          return 0;
        });
      return new_data;
    },
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="scss">
$primary: #4f5bff;
.filter-row {
  width: 80%;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  .filter-states {
    width: 400px;
  }
  .filter-field {
    select {
      background-color: white;
      color: black;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
    input {
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
  }
}
.pagination {
  margin: 20px;
  display: flex;
  justify-content: center;
  button {
    background-color: $primary;
    color: white;
    border: 0;
    font-size: 15px;
    border-radius: 5px;
    padding: 10px 20px;
    outline: none;
    cursor: pointer;
    margin-right: 10px;
  }
}
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.tableData {
  width: 80%;
  min-height: 400px;
}
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
  td,
  th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }
  th {
    cursor: pointer;
  }
}
</style>
