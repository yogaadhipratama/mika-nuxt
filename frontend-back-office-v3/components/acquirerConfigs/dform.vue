<template>
  <v-card class="pa-o ma-0 elevation-0">
    <form>
      <v-toolbar dark color="primary" flat v-if="showToolbar">
        <v-toolbar-title>Add Acquirer Config</v-toolbar-title>
        <div class="flex-grow-1"></div>
        <v-toolbar-items>
          <v-btn dark text @click="close">
            <v-icon>close</v-icon>
          </v-btn>
          <v-btn dark text @click="submit">
            <v-icon>save</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container grid-list-sm class="pa-4">
        <v-layout wrap>
          <v-flex v-for="field in formField" :key="field.key" xs12>
            <v-text-field
              v-if="field.fieldType == 'text'"
              v-model="formData[field.key]"
              v-validate="field.rules"
              :type="field.type"
              :error-messages="errors.collect(field.key)"
              :name="field.key"
              :data-vv-name="field.key"
              :data-vv-as="field.caption"
              :label="field.caption"
            />
            <v-checkbox
              v-if="field.fieldType === 'check'"
              v-model="formData[field.key]"
              :label="field.caption"
              color="primary"
            ></v-checkbox>

            <v-autocomplete
              v-if="field.key === 'handler'"
              v-model="formData[field.key]"
              v-validate="field.rules"
              :type="field.type"
              :error-messages="errors.collect(field.key)"
              :name="field.key"
              :data-vv-name="field.key"
              :data-vv-as="field.caption"
              :label="field.caption"
              :items="handlers"
              :loading="handlerLoading"
              :search-input.sync="searchHandler"
              item-text="name"
              item-value="name"
              placeholder="Start typing to Search"
              clearable
            ></v-autocomplete>
            <v-autocomplete
              v-if="field.key === 'merchantId'"
              v-model="formData[field.key]"
              v-validate="field.rules"
              :type="field.type"
              :error-messages="errors.collect(field.key)"
              :name="field.key"
              :data-vv-name="field.key"
              :data-vv-as="field.caption"
              :label="field.caption"
              :items="merchants"
              :loading="merchantLoading"
              :search-input.sync="searchMerchant"
              item-text="name"
              item-value="id"
              placeholder="Start typing to Search"
              clearable
            ></v-autocomplete>
            <v-select
              v-if="field.key == 'sandbox'"
              v-model="formData[field.key]"
              v-validate="field.rules"
              :error-messages="errors.collect(field.key)"
              :name="field.key"
              :items="items"
              :label="field.caption"
              :multiple="field.isMultiple"
            ></v-select>
            <v-textarea
              v-if="field.fieldType == 'textarea' && created == false"
              v-model="formData[field.key]"
              v-validate="field.rules"
              row-height="5"
              auto-grow
              :type="field.type"
              :error-messages="errors.collect(field.key)"
              :name="field.key"
              :data-vv-name="field.key"
              :data-vv-as="field.caption"
              :label="field.caption"
            />
            <v-text-field
              v-if="field.fieldType == 'date' && created "
              v-model="formData[field.key]"
              v-validate="field.rules"
              :type="field.type"
              :error-messages="errors.collect(field.key)"
              :name="field.key"
              :data-vv-name="field.key"
              :data-vv-as="field.caption"
              :label="field.caption"
              readonly
            />
          </v-flex>
        </v-layout>
        <div v-if="created == false">
          <h4 class="mb-4">
            Config
            <tooltip :icon="'add'" :tooltip-text="'add field config'" @onClick="configFields++"/>
            <tooltip
              v-if="configFields > 1"
              :icon="'remove'"
              :tooltip-text="'remove field config'"
              @onClick="configFields--"
            />
          </h4>
          <div v-for="(item, index) in configFields" :key="item">
            <v-text-field label="Config Key" v-model="configKeys[index]"/>
            <v-text-field label="Config Value" v-model="configValues[index]"/>
          </div>
        </div>
        <div>
          <div v-if="initialData.handler !== 'cardSwitcher' && created == true">
            <div v-if="edit == false">
              <div v-for="(data, index) in configKeys" :key="index">
                <v-text-field
                  :label="configKeys[index]"
                  v-model="configValues[index]"
                  v-if="configValues[index].length < 100"
                />
                <v-textarea
                  :label="configKeys[index]"
                  v-model="configValues[index]"
                  v-else
                  auto-grow
                />
              </div>
            </div>
            <v-textarea v-model="formData.config" auto-grow v-if="edit == true"></v-textarea>
          </div>
        </div>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <div v-if="checkRoles(permissionRole)">
          <v-btn
            v-if="!dataArchived && created"
            class="mr-3"
            color="warning"
            @click="showArchive = true"
          >
            <v-icon>archive</v-icon>
            <span class="font-weight-black">Archive</span>
          </v-btn>
          <v-btn
            v-if="dataArchived && created"
            color="warning"
            class="mr-3"
            @click="showUnarchive = true"
          >
            <v-icon>unarchive</v-icon>
            <span class="font-weight-black">Unarchive</span>
          </v-btn>
        </div>
        <v-btn color="primary" text @click="close" v-if="!created">
          <v-icon>close</v-icon>
        </v-btn>
        <v-btn color="primary" @click="submit">
          <v-icon>save</v-icon>
        </v-btn>
      </v-card-actions>
    </form>
    <confirmation
      :show="showArchive"
      :title="titleArchive"
      :text="textArchive"
      :color="'warning'"
      @onConfirm="archive"
      @onClose="showArchive = false"
    />
    <confirmation
      :show="showUnarchive"
      :title="titleUnarchive"
      :text="textUnarchive"
      :color="'warning'"
      @onConfirm="unarchive"
      @onClose="showUnarchive = false"
    />
  </v-card>
</template>

<script>
import formField from './formField'
import { catchError, checkRoles } from '~/mixins'
import debounce from 'lodash/debounce'
import confirmation from '~/components/commons/confirmation'
import tooltipButton from '~/components/commons/tooltipButton'
export default {
  $_veeValidate: {
    validator: 'new',
  },
  components: {
    confirmation,
    tooltip: tooltipButton,
  },
  mixins: [catchError, checkRoles],
  props: {
    showToolbar: {
      type: Boolean,
      required: false,
      default: false,
    },
    initialData: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    permissionRole: {
      type: String,
      required: false,
      default: 'admin',
    },
  },
  data() {
    return {
      formField: formField,
      formData: {},
      merchantLoading: false,
      searchMerchant: '',
      merchants: [],

      urlHandler: '/utilities/trx_props',
      handlers: [],
      searchHandler: '',
      handlerLoading: '',

      config: {},
      items: ['true', 'false'],
      created: false,
      configKeys: [],
      configValues: [],
      edit: false,
      showArchive: false,
      titleArchive: 'Archive',
      textArchive: 'Are you sure want to archive this data?',
      showUnarchive: false,
      titleUnarchive: 'Unarchive',
      textUnarchive: 'Are you sure want to unarchive this data?',
      dataArchived: '',
      configFields: 1,
    }
  },
  watch: {
    showToolbar() {
      this.initiateData()
    },
    searchHandler: {
      handler: debounce(function() {
        if (this.handlers.length > 0) return
        if (this.handlerLoading) return
        if (this.searchHandler == null) this.searchHandler = ''
        this.getHandlers()
      }, 500),
    },
    initialData() {
      if (Object.keys(this.initialData).length > 0) {
        this.formData = Object.assign({}, this.initialData)
        this.formData.createdAt = this.$moment(this.formData.createdAt).format(
          'YYYY-MM-DD, HH:mm:ss'
        )
        if (this.formData.archivedAt) {
          this.formData.archivedAt = this.$moment(
            this.formData.archivedAt
          ).format('YYYY-MM-DD, HH:mm:ss')
        }
        this.formData.config = this.prettier(this.formData.config)
        this.configKeys = Object.keys(this.initialData.config)
        this.configValues = Object.values(this.initialData.config)
        this.created = true
        this.dataArchived = this.formData.archivedAt
      }
    },
    searchMerchant: {
      handler: debounce(function() {
        if (this.merchants.length > 0) return
        if (this.merchantLoading) return
        if (this.searchMerchant == null) this.searchMerchant = ''
        this.getMerchants()
      }, 500),
    },
  },
  mounted() {
    this.formField.map(f => (this.formData[f.key] = f.value))
    if (Object.keys(this.initialData).length > 0) {
      this.formData = Object.assign({}, this.initialData)
      this.formData.createdAt = this.$moment(this.formData.createdAt).format(
        'YYYY-MM-DD, HH:mm:ss'
      )
      this.formData.config = this.prettier(this.formData.config)
      this.created = true
      if (this.formData.archivedAt) {
        this.formData.archivedAt = this.$moment(
          this.formData.archivedAt
        ).format('YYYY-MM-DD, HH:mm:ss')
      }
      this.configKeys = Object.keys(this.initialData.config)
      this.configValues = Object.values(this.initialData.config)

      this.dataArchived = this.formData.archivedAt
    }
  },
  methods: {
    prettier(value) {
      return JSON.stringify(value, undefined, '\t')
    },
    initiateData() {
      this.formData.directSettlement = false
      this.formData.sandbox = [false]
      this.formData.hidden = false
      this.formData.description = this.$faker.sentence()
    },
    async submit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.toConfig()
          this.$emit('onSubmit', {
            formData: this.formData,
            config: this.config,
          })
          this.close()
        }
      })
    },
    close() {
      this.$emit('onClose')
    },
    async getHandlers() {
      try {
        this.handlerLoading = true
        const resp = await this.$axios.$get(this.urlHandler)
        this.handlers = resp.data.handlers
        this.handlerLoading = false
      } catch (e) {
        this.handlerLoading = false
        this.catchError(e)
      }
    },
    async getMerchants() {
      try {
        this.merchantLoading = true
        const search =
          this.searchMerchant != ''
            ? `f[name]=like,%${this.searchMerchant}%`
            : ''
        const url = '/back_office/merchants?order_by=name&order=asc&' + search
        const resp = await this.$axios.$get(url)
        this.merchants = resp.data
        this.merchantLoading = false
      } catch (e) {
        this.merchantLoading = false
        this.catchError(e)
      }
    },
    archive() {
      this.$emit('archive')
      this.showArchive = false
    },
    unarchive() {
      this.$emit('unarchive')
      this.showUnarchive = false
    },
    toConfig() {
      const config = Object.assign(
        {},
        ...this.configKeys.map((a, b) => ({ [a]: this.configValues[b] }))
      )
      this.config = JSON.parse(JSON.stringify(config))
    },
  },
}
</script>

<style lang="scss" scoped></style>