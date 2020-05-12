<template>
  <div class="login">
    <b-jumbotron
      class="text-center mb-0"
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
          <b-card
            class="border-0"
            title="Welcome back"
            title-tag="h2"
            header-class="p-0 border-0 bg-transparent"
            body-class="px-5"
          >
            <template v-slot:header></template>

            <div class="additional">
              <!-- Twitter -->
              <b-button
                block
                size="lg"
                class="position-relative border-0"
                variant="transparent"
              >
                <img
                  class="logo position-absolute"
                  :src="require('@/assets/images/twitter_logo.svg')"
                  alt="facebook"
                />
                <span>Continue with Twitter</span>
              </b-button>

              <!-- Google -->
              <b-button
                block
                size="lg"
                class="position-relative border-0"
                variant="transparent"
              >
                <img
                  class="logo position-absolute"
                  :src="require('@/assets/images/google_logo.svg')"
                  alt="facebook"
                />
                <span>Continue with Google</span>
              </b-button>

              <!-- Apple -->
              <b-button
                block
                size="lg"
                class="position-relative border-0"
                variant="transparent"
              >
                <img
                  class="logo position-absolute"
                  :src="require('@/assets/images/apple_logo.svg')"
                  alt="facebook"
                />
                <span>Continue with Apple</span>
              </b-button>

              <span class="d-block">OR</span>
            </div>

            <b-form autocomplete="off" @submit.prevent="login">
              <b-form-group
                class="mb-4"
                invalid-feedback="Enter at least 1 character or more"
              >
                <b-form-input
                  trim
                  size="lg"
                  ref="input"
                  :state="usernameState"
                  v-model="form.username"
                  placeholder="Username"
                  @change="checkValidity"
                ></b-form-input>
              </b-form-group>

              <b-button
                block
                size="lg"
                type="submit"
                variant="primary"
                class="d-flex justify-content-center align-items-center"
                :disabled="isValid"
              >
                <b-spinner
                  small
                  v-if="loading"
                  class="mr-2"
                  label="Loading..."
                />
                Continue
              </b-button>
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
  computed: {
    usernameState() {
      if (this.hasValidated) {
        return this.form.username.length > 0 ? true : false
      } else {
        return null
      }
    },
    isValid() {
      const result = this.form.username.length > 0

      return result ? false : true
    }
  },
  data() {
    return {
      form: {
        username: ''
      },
      loading: false,
      hasValidated: false
    }
  },
  methods: {
    checkValidity() {
      if (!this.hasValidated) {
        this.hasValidated = true
      }
    },
    login() {
      this.$router.push({
        name: 'Chat',
        params: { username: this.form.username }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.lead {
  color: var(--secondary);
}

.card {
  border-radius: 8px;
  box-shadow: 0 5px 5px 0 rgba(154, 160, 185, 0.05),
    0 5px 30px 0 rgba(166, 173, 201, 0.22);

  .card-header {
    width: 100%;
    height: 6px;
    border-radius: 8px 8px 0 0;
    background-image: linear-gradient(-71deg, #4c7af1, #15c39a 95%);
  }

  .card-body {
    padding-top: 24px;
    padding-bottom: 24px;
    color: #60657b;
  }

  .card-title {
    margin-bottom: 24px;
    color: #2b2d38;
    text-align: center;
    letter-spacing: -0.2px;
    font: normal 600 36px/54px AkkuratPro;
  }

  .additional {
    .btn {
      margin-bottom: 10px;
      height: 45px;
      background: #f1f2fa;
      color: #60657b;
      font-size: 15px;
      transition: all 0.2s;

      &:hover {
        background: #f9fafd;
      }
    }

    .logo {
      top: 50%;
      left: 15px;
      width: 16px;
      height: 16px;
      transform: translateY(-50%);
    }

    > span {
      margin: 12px 0;
      color: #c6cbde;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.9px;
      font-weight: 700;
      font-size: 11px;
      line-height: 16px;
    }
  }
}

.btn.disabled {
  cursor: not-allowed;
}
</style>
