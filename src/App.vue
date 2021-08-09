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
      <div class="filter-field">
        <select v-model="filterStatus" id="status">
          <option value="" disabled="disabled" selected="selected">
            Select Status
          </option>
          <option value="confirmed">Confirmed</option>
          <option value="deceased">Deceased</option>
          <option value="recovered">Recovered</option>
          <option value="tested">Tested</option>
          <option value="vaccinated1">Vaccinated</option>
        </select>
        <select v-model="filterOperator" id="status">
          <option value="" disabled="disabled" selected="selected">
            Select Operator
          </option>
          <option value=">">&gt;</option>
          <option value="<">&lt;</option>
          <option value="=">&equals;</option>
        </select>
        <input
          type="number"
          v-model.number="filterValue"
          placeholder="Enter value"
        />
      </div>
    </div>

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
        <tr v-for="([scode, sdata], index) in displayedPages" :key="scode">
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

    <div class="pagination">
      <button @click="prevPage">Previous</button>
      <button @click="nextPage">Next</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Multiselect from "vue-multiselect";

export default {
  name: "app",
  components: { Multiselect },
  data() {
    return {
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
        WB: "West Bengal"
      },
      covid_data: [],
      loading: false,
      currentPage: 1,
      perPage: 10,
      pages: [],
      currentSort: "name",
      currentSortDir: "asc",
      selectedStates: [],
      filterStatus: "",
      filterOperator: "",
      filterValue: 0
    };
  },

  mounted() {
    this.isLoading = true;
    axios.get("https://api.covid19india.org/v4/min/data.min.json").then(res => {
      const { TT, ...rest } = res.data;
      this.covid_data = Object.entries(rest);
    });
    this.isLoading = false;
  },
  methods: {
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
    }
  },
  computed: {
    displayedPages() {
      return this.covid_data
        .sort((a, b) => {
          let modifier = 1;
          if (this.currentSortDir === "desc") modifier = -1;
          if (a[1].total[this.currentSort] < b[1].total[this.currentSort])
            return -1 * modifier;
          if (a[1].total[this.currentSort] > b[1].total[this.currentSort])
            return 1 * modifier;
          return 0;
        })
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
        });
    }
  }
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
