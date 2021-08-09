<template>
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
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  methods: {
    ...mapActions({
      updateFilterStatus: "updateFilterStatus",
      updateFilterValue: "updateFilterValue",
      updateFilterOperator: "updateFilterOperator"
    })
  },
  computed: {
    ...mapGetters({
      getFilterStatus: "getFilterStatus",
      getFilterValue: "getFilterValue",
      getFilterOperator: "getFilterOperator"
    }),

    filterValue: {
      get() {
        return this.getFilterValue;
      },
      set(value) {
        this.updateFilterValue(value);
      }
    },
    filterOperator: {
      get() {
        return this.getFilterOperator;
      },
      set(value) {
        this.updateFilterOperator(value);
      }
    },
    filterStatus: {
      get() {
        return this.getFilterStatus;
      },
      set(value) {
        this.updateFilterStatus(value);
      }
    }
  }
};
</script>

<style></style>
