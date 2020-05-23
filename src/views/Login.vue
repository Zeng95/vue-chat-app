<template>
  <div class="login vh-100 d-flex flex-column justify-content-center">
    <b-jumbotron
      fluid
      header="Real-Time Chat"
      header-level="4"
      lead="Powered by Vue.js & Firebase"
      text-variant="white"
      bg-variant="transparent"
      class="text-center mb-0 pt-0 pb-4"
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

            <!-- 第三方登录 -->
            <div class="additional">
              <!-- Twitter -->
              <b-button
                block
                size="lg"
                class="position-relative border-0"
                variant="transparent"
                @click="loginWithTwitter"
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
                @click="loginWithGoogle"
              >
                <img
                  class="logo position-absolute"
                  :src="require('@/assets/images/google_logo.svg')"
                  alt="facebook"
                />
                <span>Continue with Google</span>
              </b-button>

              <!-- Github -->
              <b-button
                block
                size="lg"
                class="position-relative border-0"
                variant="transparent"
                @click="loginWithGithub"
              >
                <img
                  class="logo position-absolute"
                  :src="require('@/assets/images/github_logo.svg')"
                  alt="facebook"
                />
                <span>Continue with Github</span>
              </b-button>

              <span class="d-block">OR</span>
            </div>

            <!-- 表单 -->
            <b-form autocomplete="off" @submit.prevent="loginWithEmail">
              <b-form-group
                class="mb-4"
                invalid-feedback="Enter at least 1 character or more"
              >
                <b-form-input
                  trim
                  size="lg"
                  ref="input"
                  placeholder="Email"
                  class="form-username"
                  :state="usernameState"
                  v-model="form.email"
                  @change="checkValidity"
                ></b-form-input>
              </b-form-group>

              <b-button
                block
                size="lg"
                type="submit"
                variant="primary"
                class="btn-login d-flex justify-content-center align-items-center"
                :disabled="isValid"
              >
                <b-spinner
                  small
                  v-if="showLoading"
                  class="mr-2"
                  label="Loading..."
                />
                Login
              </b-button>
            </b-form>
          </b-card>
        </b-col>
        <b-col lg="3"></b-col>
      </b-row>
    </b-container>

    <b-toast id="login-toast" variant="info" solid no-auto-hide>
      <template v-slot:toast-title>
        <div class="d-flex flex-grow-1 align-items-baseline">
          <strong class="mr-auto">Info</strong>
          <small class="text-muted mr-2">{{ date }}</small>
        </div>
      </template>
      Processing...
    </b-toast>

    <AppAlert
      :visible="alertShow"
      :message="alertMessage"
      :variant="alertVariant"
      @hideAlert="alertShow = !alertShow"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import moment from 'moment'
import AppAlert from '@/components/AppAlert'

export default {
  components: { AppAlert },
  computed: {
    usernameState() {
      if (this.hasValidated) {
        return this.form.email.length > 0 ? true : false
      } else {
        return null
      }
    },
    isValid() {
      const result = this.form.email.length > 0

      return result ? false : true
    },
    date() {
      return moment().format('DD MMMM, h:mm a')
    }
  },
  data() {
    return {
      form: {
        email: ''
      },
      hasValidated: false,
      showLoading: false,

      alertShow: false,
      alertMessage: '',
      alertVariant: ''
    }
  },
  methods: {
    ...mapActions('auth', [
      'signInWithTwitter',
      'signInWithGoogle',
      'signInWithGithub'
    ]),
    checkValidity() {
      if (!this.hasValidated) {
        this.hasValidated = true
      }
    },
    loginWithEmail() {
      this.navigateToChat()
    },
    async loginWithTwitter() {
      try {
        this.$bvToast.show('login-toast')
        await this.signInWithTwitter()

        this.$bvToast.hide('login-toast')
        this.navigateToChat()
      } catch (error) {
        this.$bvToast.hide('login-toast')

        this.alertShow = true
        this.alertMessage = error.message
        this.alertVariant = 'danger'
      }
    },
    async loginWithGoogle() {
      try {
        this.$bvToast.show('login-toast')
        await this.signInWithGoogle()

        this.$bvToast.hide('login-toast')
        this.navigateToChat()
      } catch (error) {
        this.$bvToast.hide('login-toast')

        this.alertShow = true
        this.alertMessage = error.message
        this.alertVariant = 'danger'
      }
    },
    async loginWithGithub() {
      try {
        this.$bvToast.show('login-toast')
        await this.signInWithGithub()

        this.$bvToast.hide('login-toast')
        this.navigateToChat()
      } catch (error) {
        this.$bvToast.hide('login-toast')

        this.alertShow = true
        this.alertMessage = error.message
        this.alertVariant = 'danger'
      }
    },
    navigateToChat() {
      this.$router.push({ name: 'Chat' })
    }
  },
  beforeCreate() {
    this.$emit('ready')
  }
}
</script>

<style lang="scss" scoped>
.login {
  background: url('../assets/images/login-background.svg') no-repeat center/100%;
}

.lead {
  margin-bottom: 0;
}

.card {
  border-radius: 8px;
  box-shadow: 0 5px 5px 0 rgba(154, 160, 185, 0.05),
    0 5px 30px 0 rgba(166, 173, 201, 0.22);
  font-family: AkkuratPro;

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
  }

  .additional {
    .btn {
      margin-bottom: 10px;
      height: 45px;
      background: #f1f2fa;
      color: #60657b;
      font: 400 16px/24px AkkuratPro;
      transition: all 0.2s;

      &:hover {
        background: #f9fafd;
      }

      &:focus {
        box-shadow: none;
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

  .form-username {
    letter-spacing: 0.2px;
    font: 400 16px/24px AkkuratPro;

    &::placeholder {
      color: #c6cbde;
    }
  }

  ::v-deep.invalid-feedback {
    font-size: 1rem;
  }

  .btn-login {
    &.disabled {
      cursor: not-allowed;
    }
  }
}
</style>
