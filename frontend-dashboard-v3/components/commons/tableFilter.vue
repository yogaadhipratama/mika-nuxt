<template>
  <v-card-title>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex md3 sm6 xs12>
          <v-combobox
            v-model="selectedFilterBy"
            :items="filterBy"
            label="Filter by"
            cache-items
            type="button"
          ></v-combobox>
        </v-flex>
        <v-flex md3 sm6 xs12>
          <v-combobox v-model="operator" :items="operators" label="Operator" type="button"></v-combobox>
        </v-flex>
        <v-flex md3 sm6 xs12>
          <span v-if="filterValues.length > 0">
            <v-combobox
              v-model="filterValue"
              :items="filterValues"
              label="Filter Value"
              :disabled="filterValues.length === 0"
            ></v-combobox>
          </span>
          <span v-else>
            <v-text-field :disabled="selectedFilterBy === ''" v-model="filterValue"></v-text-field>
          </span>
        </v-flex>
        <v-flex md3 sm6 xs12>
          <date-picker v-model="date1" range :shortcuts="shortcuts" lang="en" width="100%"></date-picker>
        </v-flex>
      </v-layout>

      <v-toolbar flat>
        <v-spacer></v-spacer>
        <Tbtn text tooltipTop icon="clear" tooltip-text="clear filter" @onClick="clearFilter" />
        <Tbtn
          text
          tooltipTop
          icon="cloud_download"
          tooltip-text="export to csv"
          @onClick="showConfirmDialog = true"
        />
        <Tbtn
          text
          tooltipTop
          icon="check"
          tooltip-text="apply filter"
          :disabled="btnDisabled"
          @onClick="applyFilter"
        />
      </v-toolbar>
      <confirmDialog
        :show="showConfirmDialog"
        @onClose="showConfirmDialog = false"
        @onConfirm="download"
        title="Export to CSV"
      ></confirmDialog>
    </v-container>
  </v-card-title>
</template>

<script>
import { datePickerShortcut } from "~/mixins";
import confirmDialog from "./confirmDialog";
import Tbtn from "./Tbtn";
import { ExportToCsv } from "export-to-csv";
export default {
  components: { Tbtn, confirmDialog },
  mixins: [datePickerShortcut],
  props: {
    filterBy: {
      type: Array,
      required: true
    },

    filterValues: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    },
    dataToDownload: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selectedFilterBy: null,
      operator: null,
      filterValue: null,
      operators: [
        { text: "=", value: "eq" },
        { text: "<=", value: "lte" },
        { text: ">=", value: "gte" }
      ],
      date1: null,
      shortcuts: [],
      btnDisabled: true,
      showConfirmDialog: false
    };
  },
  watch: {
    selectedFilterBy() {
      this.filterValue = null;
      this.$emit("selectedFilterBy", this.selectedFilterBy);
    },
    operator() {
      this.$emit("operatorChange", this.operator);
    },
    filterValue() {
      if (this.filterValue) this.btnDisabled = false;
      this.$emit("filterValueChange", this.filterValue);
    },
    date1() {
      if (this.date1) this.btnDisabled = false;
      this.$emit("dateChange", this.date1);
    }
  },
  mounted() {
    this.shortcuts = this.generateShortcut();
    this.operator = this.operators[0];
  },
  methods: {
    checkFilterDisabled() {
      return true;
    },
    clearFilter() {
      this.$emit("clearFilter");
    },
    applyFilter() {
      this.$emit("applyFilter");
    },
    clearFilter() {
      this.filterValue = null;
      this.selectedFilterBy = null;
      this.operator = this.operators[0];
      this.date1 = null;
      this.btnDisabled = true;
      this.$emit("clearFilter");
    },
    csvExport(title, data) {
      const options = {
        filename: title,
        fieldSeparator: ",",
        quoteStrings: '"',
        decimalseparator: ".",
        showLabels: true,
        showTitle: true,
        title: title,
        useBom: true,
        useKeysAsHeaders: true
      };

      if (data.length) {
        const csvExporter = new ExportToCsv(options);
        csvExporter.generateCsv(data);
      }
    },
    download(type) {
      this.showConfirmDialog = false;
      this.csvExport("Transactions", this.dataToDownload);
    }
  }
};
</script>
<style lang="scss" scoped>
.v-menu input[type="button"][role="combobox"] {
  text-align: left;
}
</style>


