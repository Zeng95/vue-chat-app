<template>
  <div class="login">
    <b-jumbotron
      class="text-center"
      text-variant="primary"
      bg-variant="transparent"
      header="Real-Time Chat"
      lead="Powered by Vue.js & Firebase"
      lead-tag="h5"
    />

    <b-container>
      <b-row>
        <b-col lg="3"></b-col>
        <b-col lg="6">
          <b-card title="Login" title-tag="h2" align="center">
            <b-form @submit="onSubmit">
              <b-form-group>
                <b-form-input
                  required
                  v-model="form.username"
                  placeholder="Please enter your name ..."
                ></b-form-input>
              </b-form-group>

              <b-button type="submit" variant="primary">Enter Chat</b-button>
            </b-form>
          </b-card>
        </b-col>
        <b-col lg="3"></b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: ''
      }
    }
  },
  methods: {
    onSubmit() {}
  }
}
</script>

<style lang="scss" scoped>
.lead {
  color: var(--secondary);
}
</style>
