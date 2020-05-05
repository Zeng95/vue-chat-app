<template>
  <div class="login">
    <NavBar />

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
import NavBar from '@/components/NavBar'

export default {
  components: { NavBar },
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
