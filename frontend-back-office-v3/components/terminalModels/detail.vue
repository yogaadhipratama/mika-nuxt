<template>
  <v-card class="mt-6" flat>
    <formAdd
      :form-field="formField"
      :initial-data="initialData"
      :permission-role="permissionRole"
      @onSubmit="submit"
      @archive="archive"
      @unarchived="unarchived"
    />
  </v-card>
</template>

<script>
import { formAdd } from '../commons'
import formField from './formField'
import { catchError, toArchive } from '~/mixins'
export default {
  components: {
    formAdd,
  },
  mixins: [catchError, toArchive],
  data() {
    return {
      url: '/back_office/terminal_models',
      formField: formField,
      initialData: {},
      permissionRole: 'adminSupport',
    }
  },
  computed: {
    currentEdit() {
      return this.$store.state.currentEdit
    },
  },
  watch: {
    currentEdit() {
      this.populateInitialData()
    },
  },

  mounted() {
    this.populateInitialData()
  },

  methods: {
    async submit(data) {
      try {
        const postData = {
          name: data.name,
          manufacturer: data.manufacturer,
          description: data.description,
        }
        const response = await this.$axios.$put(
          `${this.url}/${this.currentEdit.id}`,
          postData
        )
        if (response.status !== 'ent-406') {
          this.$store.commit('currentEdit', response.data)
          this.showSnackbar('success', `Data successfuly edited`)
        }
      } catch (e) {
        this.catchError(e)
      }
    },
    populateInitialData() {
      if (this.currentEdit) {
        this.initialData = {
          id: this.currentEdit.id,
          name: this.currentEdit.name,
          manufacturer: this.currentEdit.manufacturer,
          description: this.currentEdit.description,
          createdAt: this.currentEdit.createdAt,
          archivedAt: this.currentEdit.archivedAt,
        }
      }
    },
  },
}
</script>

<style></style>
