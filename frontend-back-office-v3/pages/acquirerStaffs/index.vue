<template>
  <div>
    <pageTitle :title="`${$changeCase.titleCase(resource)} List`" icon="supervisor_account"></pageTitle>
    <v-card card flat>
      <v-card-title>
        <tableHeader
          :filter="headers"
          :btn-add-text="btnAddText"
          :show-add-btn="showAddBtn"
          :permission-role="permissionRole"
          @showForm="modalAddForm = !modalAddForm"
          @applyFilter="populateData"
          @downloadCsv="downloadCsv"
        />
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="items"
        :options.sync="options"
        :server-items-length="totalCount"
        :loading="loading"
        :footer-props="footerProps"
        class="elevation-0 pa-2"
      >
        <template v-slot:item.name="{ item }">
          <a @click="toDetail(item.id)">{{ item.name }}</a>
        </template>
        <template
          v-slot:item.createdAt="{ item }"
        >{{ $moment(item.createdAt).format('YYYY-MM-DD') }}</template>
        <template v-slot:item.archivedAt="{ item }">
          <div v-if="item.archivedAt">{{ $moment(item.archivedAt).format('YYYY-MM-DD') }}</div>
          <div v-else>-</div>
        </template>
      </v-data-table>
    </v-card>
    <dform :show="modalAddForm" @onClose="modalAddForm = false"></dform>
  </div>
</template>

<script>
import { catchError, tableMixin } from "~/mixins";
import debounce from "lodash/debounce";
import { tableHeader, pageTitle } from "~/components/commons";
import dform from "~/components/acquirers/dform";

export default {
  components: {
    tableHeader,
    dform,
    pageTitle
  },
  mixins: [catchError, tableMixin],
  data() {
    return {
      resource: "acquirerStaffs",
      url: "/back_office/acquirer_staffs",
      btnAddText: "Add Acquirer Staff",
      showAddBtn: false,
      headers: [
        {
          text: "Name",
          align: "left",
          sortable: true,
          value: "name"
        },
        {
          text: "Acquirer Company",
          value: "acquirerCompanyId"
        },
        {
          text: "Date",
          sortable: true,
          value: "createdAt"
        },
        {
          text: "Archived At",
          sortable: true,
          value: "archivedAt"
        }
      ],
      dataToDownload: [],
      modalAddForm: false,
      permissionRole: "adminMarketing"
    };
  },
  watch: {
    options: {
      handler: debounce(function() {
        this.populateData();
      }, 500),
      deep: true
    }
  },
  mounted() {
    this.populateData();
  },
  methods: {
    async populateData() {
      try {
        this.loading = true;
        const queries = this.getQueries();
        const response = await this.$axios.$get(this.url + queries);
        this.totalCount = response.meta ? response.meta.totalCount : 0;
        this.items = response.data;
        this.generateDownload(this.items);
        this.loading = false;
      } catch (e) {
        this.catchError(e);
      }
    },
    downloadCsv() {
      this.csvExport(
        `${this.$changeCase.titleCase(this.resource)}s`,
        this.dataToDownload
      );
    },
    generateDownload(data) {
      data.map(d => {
        this.dataToDownload.push({
          name: d.name,
          description: d.description,
          acquirerCompanyId: d.acquirerCompanyId,
          created_at: this.$moment(d.created_at).format("YYYY-MM-DD HH:mm:ss"),
          updated_at: this.$moment(d.updated_at).format("YYYY-MM-DD HH:mm:ss"),
          archived_at: this.$moment(d.archived_at).format("YYYY-MM-DD HH:mm:ss")
        });
      });
    },
    toDetail(id) {
      this.$router.push(`/${this.resource}/${id}`);
    }
  }
};
</script>

<style></style>
