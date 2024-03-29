<template>
  <div>
    <form>
      <v-card flat>
        <v-toolbar v-if="withTopToolbar" flat>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="submit">
            <v-icon left>save</v-icon>Save
          </v-btn>
        </v-toolbar>
        <v-divider v-if="withTopToolbar" class="mb-4"></v-divider>
        <v-container fluid grid-list-md>
          <v-layout wrap>
            <v-flex v-for="field in formField" :key="field.key" :sm6="sm6" xs12>
              <v-text-field
                v-if="field.fieldType == 'text' && !field.readonly"
                v-model="formData[field.key]"
                v-validate="field.rules"
                :type="field.type"
                :error-messages="errors.collect(field.key)"
                :name="field.key"
                :data-vv-name="field.key"
                :data-vv-as="field.caption"
                :label="field.caption"
              />
              <v-text-field
                v-if="field.fieldType == 'text' && field.readonly == true"
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
              <v-select
                v-if="field.fieldType == 'select'"
                v-model="formData[field.key]"
                v-validate="field.rules"
                :error-messages="errors.collect(field.key)"
                :name="field.key"
                :items="propsData[field.props]"
                :label="field.caption"
                :multiple="field.isMultiple"
              ></v-select>
              <v-textarea
                v-if="field.fieldType == 'textarea'"
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
              <v-select
                v-if="field.fieldType == 'selectObject'"
                v-model="formData[field.key]"
                v-validate="field.rules"
                :error-messages="errors.collect(field.key)"
                :name="field.key"
                :items="propsData[field.props]"
                :label="field.caption"
                :multiple="field.isMultiple"
                item-text="text"
                item-value="value"
              ></v-select>
              <v-checkbox
                v-if="field.fieldType === 'check'"
                v-model="formData[field.key]"
                :label="field.caption"
              ></v-checkbox>
              <v-menu
                v-if="field.fieldType == 'datePicker'"
                ref="menu1"
                v-model="menu1"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="formData[field.key]"
                    :label="field.caption"
                    hint="YYYY-MM-DD format"
                    persistent-hint
                    @blur="date = parseDate(formData[field.key])"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="formData[field.key]" no-title @input="menu1 = false"></v-date-picker>
              </v-menu>
              <span v-if="field.key == 'logo'">Logo</span>
              <picture-input
                v-if="field.fieldType == 'file' && field.key == 'logo'"
                v-model="formData[field.key]"
                ref="pictureInput"
                @change="onChangeLogo"
                width="300"
                height="150"
                margin="16"
                accept="image/jpeg, image/png"
                size="10"
                buttonClass="btn"
                :prefill="formData[field.key]"
                :prefillOptions="{mediaType: 'image/jpeg'}"
                :customStrings="{
        upload: '',
        drag: '<span>Drag or click<span>'
      }"
                :removable="true"
                :crop="true"
              ></picture-input>
              <span v-if="field.key == 'icon'">Icon</span>
              <picture-input
                v-if="field.fieldType == 'file' && field.key == 'icon'"
                v-model="formData[field.key]"
                ref="pictureInput"
                @change="onChangeIcon"
                width="100"
                height="100"
                margin
                accept="image/jpeg, image/png"
                size="10"
                buttonClass="btn"
                :prefill="formData[field.key]"
                :prefillOptions="{mediaType: 'image/png'}"
                :customStrings="{
        upload: '',
        drag: '<span>Drag or click<span>'
      }"
                :removable="true"
                :crop="true"
              ></picture-input>
              <v-menu
                v-if="field.fieldType == 'colorPicker'"
                ref="menu2"
                v-model="menu1"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="formData[field.key]"
                    :label="field.caption"
                    persistent-hint
                    @blur="date = parseDate(formData[field.key])"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-color-picker v-model="formData[field.key]" @input="menu2 = false"></v-color-picker>
              </v-menu>
            </v-flex>
          </v-layout>
        </v-container>
        <v-divider class="mb-4"></v-divider>
        <v-toolbar v-if="checkRoles(permissionRole)" flat>
          <v-spacer></v-spacer>
          <div v-show="btnShowArchive">
            <v-btn
              v-if="!dataArchived && created"
              color="warning"
              class="mr-3"
              @click="confirmShowArchive = true"
            >
              <v-icon left>archive</v-icon>
              <span class="font-weight-black">Archive</span>
            </v-btn>
            <v-btn
              v-if="dataArchived && created"
              color="warning"
              class="mr-3"
              @click="confirmShowUnarchive = true"
            >
              <v-icon left>unarchive</v-icon>
              <span class="font-weight-black">Unarchive</span>
            </v-btn>
          </div>
          <v-btn class="mr-2" color="warning" @click="onReset" v-if="created == false">
            <v-icon left>refresh</v-icon>
            <span class="font-weight-black">Reset</span>
          </v-btn>
          <v-btn color="primary" @click="submit">
            <v-icon left>save</v-icon>
            <span class="font-weight-black">Save</span>
          </v-btn>
        </v-toolbar>
      </v-card>
    </form>
    <confirmation
      :show="confirmShowArchive"
      :title="confirmTitleArchive"
      :text="confirmTextArchive"
      :color="warningColor"
      @onClose="confirmShowArchive = false"
      @onConfirm="archive"
    />
    <confirmation
      :show="confirmShowUnarchive"
      :title="confirmTitleUnarchive"
      :text="confirmTextUnarchive"
      :color="warningColor"
      @onClose="confirmShowUnarchive = false"
      @onConfirm="unarchived"
    />
  </div>
</template>

<script>
import { catchError, checkRoles } from '~/mixins'
import Filters from 'vue2-filters'
import confirmation from './confirmation'

export default {
  $_veeValidate: {
    validator: 'new',
  },
  components: {
    confirmation,
  },
  mixins: [catchError, checkRoles, Filters],
  props: {
    formField: {
      type: Array,
      required: true,
    },
    initialData: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    sm6: {
      type: Boolean,
      default: false,
    },
    withTopToolbar: {
      type: Boolean,
      default: false,
    },
    propsData: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    permissionRole: {
      type: String,
      default: 'admin',
      required: false,
    },
    btnShowArchive: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  data() {
    return {
      formData: {},
      loading: false,
      menu1: false,
      menu2: false,
      dataArchived: '',
      created: false,
      confirmShowArchive: false,
      confirmTitleArchive: 'Archive',
      confirmTextArchive: '',
      confirmShowUnarchive: false,
      confirmTitleUnarchive: 'Unarchive',
      confirmTextUnarchive: '',
      warningColor: 'warning',
      image: null,
    }
  },

  watch: {
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
        this.created = true
        this.dataArchived = this.formData.archivedAt
      }
    },
  },
  mounted() {
    this.formField.map(f => (this.formData[f.key] = f.value))
    if (Object.keys(this.initialData).length > 0) {
      this.formData = Object.assign({}, this.initialData)
      this.dataArchived = this.formData.archivedAt
      this.formData.createdAt = this.$moment(this.formData.createdAt).format(
        'YYYY-MM-DD, HH:mm:ss'
      )
      if (this.formData.archivedAt) {
        this.formData.archivedAt = this.$moment(
          this.formData.archivedAt
        ).format('YYYY-MM-DD, HH:mm:ss')
      }
      this.created = true
    }
  },
  methods: {
    thousandSeparator(value) {
      let amount = parseInt(value).toLocaleString()
      return amount
    },
    async submit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.$emit('onSubmit', this.formData)
          this.close()
        }
      })
    },
    close() {
      this.$emit('close')
    },
    parseDate(date) {
      if (!date) return null

      const [month, day, year] = date.split('/')
      return `${month}/${day}/${year}`
    },
    archive() {
      this.$emit('archive')
      this.confirmShowArchive = false
    },
    unarchived() {
      this.$emit('unarchived')
      this.confirmShowUnarchive = false
    },
    onReset() {
      this.formData = {}
    },
    onChangeIcon(value) {
      if (value) {
        this.formData.icon = value
      } else {
        this.showSnackbar(
          'error',
          'FileReader API not supported: use the <form>, Luke!'
        )
      }
    },
    onChangeLogo(image) {
      if (image) {
        this.formData.logo = image
      } else {
        this.showSnackbar(
          'error',
          'FileReader API not supported: use the <form>, Luke!'
        )
      }
    },
  },
}
</script>
