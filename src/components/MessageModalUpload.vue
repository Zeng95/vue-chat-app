<template>
  <b-modal
    centered
    id="modal-upload"
    title="Upload file (jpeg, png, imb max)"
    ok-title="Send"
    @ok="uploadFile"
  >
    <b-form-file
      v-model="file"
      placeholder="Choose a file or drop it here..."
      drop-placeholder="Drop file here..."
    ></b-form-file>
  </b-modal>
</template>

<script>
export default {
  name: 'MessageModalUpload',
  data() {
    return {
      file: null
    }
  },
  methods: {
    uploadFile() {
      if (this.file === null) return false
    }
  }
}
</script>

<style></style>
