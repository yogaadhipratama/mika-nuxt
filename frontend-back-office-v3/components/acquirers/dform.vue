<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay>
    <v-card>
      <form>
        <v-toolbar dark color="primary" flat>
          <v-toolbar-title>Add Acquirer</v-toolbar-title>
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
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex v-for="field in formField" :key="field.key" :sm6="sm6" xs12>
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

              <v-autocomplete
                v-if="field.key === 'acquirerConfigId'"
                v-model="formData[field.key]"
                v-validate="field.rules"
                :type="field.type"
                :error-messages="errors.collect(field.key)"
                :name="field.key"
                :data-vv-name="field.key"
                :data-vv-as="field.caption"
                :label="field.caption"
                :items="configs"
                :loading="configLoading"
                :search-input.sync="searchConfig"
                item-text="name"
                item-value="id"
                placeholder="Start typing to Search"
                clearable
              ></v-autocomplete>

              <v-autocomplete
                v-if="field.key === 'acquirerTypeId'"
                v-model="formData[field.key]"
                v-validate="field.rules"
                :type="field.type"
                :error-messages="errors.collect(field.key)"
                :name="field.key"
                :data-vv-name="field.key"
                :data-vv-as="field.caption"
                :label="field.caption"
                :items="types"
                :loading="typeLoading"
                :search-input.sync="searchType"
                item-text="name"
                item-value="id"
                placeholder="Start typing to Search"
                clearable
              ></v-autocomplete>

              <v-textarea
                v-if="field.fieldType == 'textarea'"
                v-model="formData[field.key]"
                v-validate="field.rules"
                :type="field.type"
                :error-messages="errors.collect(field.key)"
                :name="field.key"
                :data-vv-name="field.key"
                :data-vv-as="field.caption"
                :label="field.caption"
              />
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="close">
            <v-icon>close</v-icon>
          </v-btn>
          <v-btn color="primary" @click="submit">
            <v-icon>save</v-icon>
          </v-btn>
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</template>

<script>
import formField from './formField'
import { catchError } from '~/mixins'
import debounce from 'lodash/debounce'
export default {
  $_veeValidate: {
    validator: 'new',
  },
  mixins: [catchError],
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      formField: formField,
      sm6: true,
      formData: {},
      merchantLoading: false,
      searchMerchant: '',
      merchants: [],

      configLoading: false,
      searchConfig: '',
      configs: [],

      typeLoading: false,
      searchType: '',
      types: [],
    }
  },
  watch: {
    show() {
      this.dialog = this.show
      this.initiateData()
    },
    searchMerchant: {
      handler: debounce(function() {
        if (this.merchants.length > 0) return
        if (this.merchantLoading) return
        if (this.searchMerchant == null) this.searchMerchant = ''
        this.getMerchants()
      }, 500),
    },
    searchConfig: {
      handler: debounce(function() {
        if (this.configs.length > 0) return
        if (this.configLoading) return
        if (this.searchConfig == null) this.searchConfig = ''
        this.getConfigs()
      }, 500),
    },

    searchType: {
      handler: debounce(function() {
        if (this.types.length > 0) return
        if (this.typeLoading) return
        if (this.searchType == null) this.searchType = ''
        this.getTypes()
      }, 500),
    },
  },
  mounted() {
    this.formField.map(f => (this.formData[f.key] = f.value))
  },
  methods: {
    initiateData() {
      this.formData.name = this.$faker.animal()
      this.formData.minimumAmount = this.$faker.integer({
        min: 1,
        max: 3,
      })
      this.formData.maximumAmount = this.$faker.integer({
        min: 1,
        max: 3,
      })
      this.formData.processFee = this.$faker.integer({ min: 100, max: 200 })
      this.formData.shareAcquirer = this.$faker.integer({ min: 1, max: 2 })
      this.formData.shareMerchant = this.$faker.integer({ min: 1, max: 2 })
      this.formData.shareMerchantWithPartner = this.$faker.integer({
        min: 1,
        max: 2,
      })
      this.formData.sharePartner = this.$faker.integer({ min: 1, max: 2 })
      this.formData.directSettlement = false
      this.formData.gateway = true
      this.formData.hidden = false
      // this.formData.merchantId = this.$faker.
      // this.formData.acquirerConfigId = this.$faker.
      // this.formData.acquirerTypeId = this.$faker.
      this.formData.description = this.$faker.sentence()
    },
    async submit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.$emit('onSubmit', this.formData)
          this.close()
          this.formData = {}
        }
      })
    },
    close() {
      this.$emit('onClose')
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
    async getConfigs() {
      try {
        this.configLoading = true
        const search =
          this.searchConfig != '' ? `f[name]=like,%${this.searchConfig}%` : ''
        const url =
          '/back_office/acquirer_configs?order_by=name&order=asc&' + search
        const resp = await this.$axios.$get(url)
        this.configs = resp.data
        this.configLoading = false
      } catch (e) {
        this.configLoading = false
        this.catchError(e)
      }
    },
    async getTypes() {
      try {
        this.typeLoading = true
        const search =
          this.searchType != '' ? `f[name]=like,%${this.searchType}%` : ''
        const url =
          '/back_office/acquirer_types?order_by=name&order=asc&' + search
        const resp = await this.$axios.$get(url)
        this.types = resp.data
        this.typeLoading = false
      } catch (e) {
        this.typeLoading = false
        this.catchError(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>