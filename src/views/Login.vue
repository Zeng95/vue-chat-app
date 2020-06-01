<template>
  <div class="login vh-100 d-flex flex-column justify-content-center">
    <b-jumbotron
      header="Real-Time Chat"
      header-level="4"
      lead="Powered by Vue.js & Firebase"
      text-variant="white"
      bg-variant="transparent"
      class="text-center mb-0 pt-0 pb-4"
    />

    <b-card
      class="border-0 mx-auto"
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
      <b-form autocomplete="off" @submit.stop.prevent="loginWithEmailAndPwd">
        <b-form-group class="mb-4" invalid-feedback="Invalid email">
          <b-form-input
            trim
            size="lg"
            placeholder="Email"
            class="form-email"
            :state="validateState('email')"
            v-model="$v.form.email.$model"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          class="mb-4"
          invalid-feedback="Invalid password"
          v-if="inputPwdShow"
        >
          <b-form-input
            trim
            size="lg"
            placeholder="Password"
            class="form-password"
            :state="validateState('password')"
            v-model="$v.form.password.$model"
          ></b-form-input>
        </b-form-group>

        <b-button
          block
          size="lg"
          type="submit"
          variant="primary"
          class="btn-login d-flex justify-content-center align-items-center"
          :disabled="btnDisabled"
        >
          <b-spinner small v-if="loadingShow" class="mr-2" label="Loading..." />
          <span>{{ !inputPwdShow ? 'Continue' : 'Login' }}</span>
        </b-button>
      </b-form>
    </b-card>

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
import { email, required } from 'vuelidate/lib/validators'
import moment from 'moment'
import AppAlert from '@/components/AppAlert'

export default {
  components: { AppAlert },
  computed: {
    date() {
      return moment().format('DD MMMM, h:mm a')
    }
  },
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      loadingShow: false,
      inputPwdShow: false,

      alertShow: false,
      alertMessage: '',
      alertVariant: '',

      btnDisabled: false
    }
  },
  validations: {
    form: {
      email: {
        email,
        required
      },
      password: {
        required
      }
    }
  },
  methods: {
    ...mapActions('auth', [
      'signInWithTwitter',
      'signInWithGoogle',
      'signInWithGithub'
    ]),
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name]

      return $dirty ? !$error : null
    },
    loginWithEmailAndPwd() {
      if (!this.$v.form.email.$error && !this.inputPwdShow) {
        this.inputPwdShow = true
        return false
      }

      this.$v.form.$touch()

      if (this.$v.form.$anyError) {
        return false
      }

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
  background: url('../assets/images/login-background.svg') no-repeat
    center/cover;
}

.lead {
  margin-bottom: 0;
}

.card {
  width: 520px;
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

  .form-email,
  .form-password {
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
