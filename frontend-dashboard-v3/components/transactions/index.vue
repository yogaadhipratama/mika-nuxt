<template>
  <v-card flat class="mt-5">
    <table-filter
      :filterBy="filterBy"
      @selectedFilterBy="handelSelectedFilterBy"
      @operatorChange="handleOperatorChange"
      :filterValues="filterValues"
      @filterValueChange="handleFilterValueChange"
      @clearFilter="clearFilter"
      @applyFilter="populateTable"
      :loading="loading"
      @dateChange="handleDateChange"
      :data-to-download="dataToDownload"
    />
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="items"
        :options.sync="options"
        :server-items-length="total"
        :loading="loading"
        :footer-props="footerProps"
      >
        <template v-slot:item.amount="{ item }">{{ formatNumber(item.amount) }}</template>
        <template v-slot:item.createdAt="{ item }">{{ dateFilter(item.createdAt) }}</template>
        <template v-slot:item.time="{ item }">{{ timeFilter(item.createdAt) }}</template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import { transaction } from "~/mixins";
import { TRANSACTION_URL } from "~/lib/apis";
import parseDataToDownload from "~/lib/parseDataToDownload";
import debounce from "lodash/debounce";
import tableFilter from "~/components/commons/tableFilter";
export default {
  mixins: [transaction],
  components: { tableFilter },
  data: () => ({
    headers: [
      {
        text: "ID",
        value: "id",
        sortable: false,
        filterAs: "id"
      },
      {
        text: "Agent",
        value: "agent.name",
        sortable: false,
        filterAs: "agentId"
      },
      {
        text: "Acquirer",
        value: "acquirer.acquirerType.name",
        sortable: false,
        filterAs: "acquirerId"
      },
      {
        text: "Outlet",
        value: "agent.outlet.name",
        sortable: false,
        filterAs: "agent.outletId"
      },
      {
        text: "Amount",
        value: "amount",
        align: "right"
      },
      {
        text: "Status",
        value: "status"
      },
      {
        text: "Date",
        value: "createdAt"
      },
      {
        text: "Time",
        value: "time",
        sortable: false
      }
    ],

    filterSelectable: [
      { key: "agentId", value: "agents" },
      { key: "acquirerId", value: "acquirers" },
      { key: "status", value: "status" },
      { key: "agent.outletId", value: "outlets" }
    ],
    dataToDownload: []
  }),
  mounted() {
    this.populateTable();
    this.setFilterBy();
  },
  watch: {
    options: {
      handler: debounce(function() {
        this.populateTable();
      }, 500),
      deep: true
    },
    selectedFilterBy() {
      if (this.selectedFilterBy) {
        this.getFilterValues(this.selectedFilterBy.value);
      }
    }
  },
  methods: {
    async populateTable() {
      try {
        this.loading = true;
        const { sortBy, descending, page, itemsPerPage } = this.options;
        const queries = this.getQueries();
        const resp = await this.$axios.$get(TRANSACTION_URL + queries);
        this.total = resp.meta ? resp.meta.totalCount : 0;
        this.items = resp.data;
        this.dataToDownload = parseDataToDownload("merchant", this.items);

        this.loading = false;
      } catch (e) {
        this.catchError(e);
      }
    }
  }
};
</script>

