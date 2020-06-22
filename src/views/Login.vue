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
      footer-tag="footer"
      header-class="p-0 border-0 bg-transparent"
      body-class="px-5"
      footer-class="text-center border-0 bg-transparent"
    >
      <template v-slot:header></template>

      <!-- 第三方登录 -->
      <div class="additional">
        <!-- Twitter -->
        <b-button block class="btn-unstyled" @click="loginWithTwitter">
          <img
            class="logo"
            :src="require('@/assets/images/twitter_logo.svg')"
            alt="twitter"
          />
          <span>Continue with Twitter</span>
        </b-button>

        <!-- Google -->
        <b-button block class="btn-unstyled" @click="loginWithGoogle">
          <img
            class="logo"
            :src="require('@/assets/images/google_logo.svg')"
            alt="google"
          />
          <span>Continue with Google</span>
        </b-button>

        <!-- Github -->
        <b-button block class="btn-unstyled" @click="loginWithGithub">
          <img
            class="logo"
            :src="require('@/assets/images/github_logo.svg')"
            alt="github"
          />
          <span>Continue with Github</span>
        </b-button>
      </div>

      <span class="or">OR</span>

      <!-- 表单 -->
      <b-form
        novalidate
        class="form"
        autocomplete="off"
        @submit.stop.prevent="loginWithEmailAndPwd"
      >
        <!-- 邮箱 -->
        <b-form-group class="mb-4" invalid-feedback="Invalid email">
          <b-form-input
            trim
            type="email"
            class="email"
            placeholder="Email"
            :state="validateState('email')"
            v-model="$v.form.email.$model"
          ></b-form-input>
        </b-form-group>

        <!-- 密码 -->
        <b-form-group
          v-if="inputPwdShow"
          class="mb-4"
          invalid-feedback="Use 6 characters or more"
        >
          <b-form-input
            trim
            type="password"
            placeholder="Password"
            class="password"
            :state="validateState('password')"
            v-model="$v.form.password.$model"
          ></b-form-input>
        </b-form-group>

        <!-- 按钮 -->
        <b-button
          block
          size="lg"
          type="submit"
          variant="primary"
          :disabled="$v.form.email.$invalid"
          class="btn-login d-flex justify-content-center align-items-center"
        >
          <b-spinner v-if="loadingShow" label="Loading..." />
          <span v-else>{{ !inputPwdShow ? 'Continue' : 'Login' }}</span>
        </b-button>
      </b-form>

      <template v-slot:footer>
        <router-link :to="{ name: 'Register' }" class="create-account-callout">
          Don’t have an account?
        </router-link>
      </template>
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
import { email, required, minLength } from 'vuelidate/lib/validators'
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
      inputPwdShow: false,

      alertShow: false,
      alertMessage: '',
      alertVariant: '',

      loadingShow: false
    }
  },
  validations: {
    form: {
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(6)
      }
    }
  },
  methods: {
    ...mapActions('auth', [
      'signInWithTwitter',
      'signInWithGoogle',
      'signInWithGithub',
      'signInWithEmailAndPwd'
    ]),
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name]

      return $dirty ? !$error : null
    },
    navigateToChat() {
      this.$router.push({ name: 'Chat' })
    },

    async loginWithTwitter() {
      try {
        this.$bvToast.show('login-toast')
        await this.signInWithTwitter()

        this.alertShow = true
        this.alertMessage = 'Login successfully.'
        this.alertVariant = 'success'

        this.navigateToChat()
      } catch (error) {
        this.alertShow = true
        this.alertMessage = error.message
        this.alertVariant = 'danger'
      } finally {
        this.$bvToast.hide('login-toast')
      }
    },
    async loginWithGoogle() {
      try {
        this.$bvToast.show('login-toast')
        await this.signInWithGoogle()

        this.alertShow = true
        this.alertMessage = 'Login successfully.'
        this.alertVariant = 'success'

        this.navigateToChat()
      } catch (error) {
        this.alertShow = true
        this.alertMessage = error.message
        this.alertVariant = 'danger'
      } finally {
        this.$bvToast.hide('login-toast')
      }
    },
    async loginWithGithub() {
      try {
        this.$bvToast.show('login-toast')
        await this.signInWithGithub()

        this.alertShow = true
        this.alertMessage = 'Login successfully.'
        this.alertVariant = 'success'

        this.navigateToChat()
      } catch (error) {
        this.alertShow = true
        this.alertMessage = error.message
        this.alertVariant = 'danger'
      } finally {
        this.$bvToast.hide('login-toast')
      }
    },
    async loginWithEmailAndPwd() {
      try {
        // 显示密码输入框，退出函数
        if (!this.inputPwdShow) {
          this.inputPwdShow = true
          return false
        }

        // 邮箱校验通过，已显示密码输入框
        if (this.inputPwdShow) {
          this.$v.form.password.$touch()

          if (this.$v.form.password.$anyError) {
            return false
          }

          this.loadingShow = true
          this.$bvToast.show('login-toast')

          await this.signInWithEmailAndPwd({
            email: this.form.email,
            password: this.form.password
          })

          this.alertShow = true
          this.alertMessage = 'Login successfully.'
          this.alertVariant = 'success'

          this.navigateToChat()
        }
      } catch (error) {
        this.alertShow = true
        this.alertMessage = error.message
        this.alertVariant = 'danger'
      } finally {
        this.loadingShow = false
        this.$bvToast.hide('login-toast')
      }
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
  color: #0e101a;
  font-family: Inter;

  .lead {
    margin-bottom: 0;
  }

  .card {
    width: 520px;
    border-radius: 8px;
    box-shadow: 0 5px 5px 0 rgba(154, 160, 185, 0.05),
      0 5px 30px 0 rgba(166, 173, 201, 0.22);

    .card-header {
      width: 100%;
      height: 6px;
      border-radius: 8px 8px 0 0;
      background-image: linear-gradient(-71deg, #4c7af1, #15c39a 95%);
    }

    .card-title {
      margin-bottom: 24px;
      color: #2b2d38;
      text-align: center;
      font-weight: 600;
      line-height: 40px;
    }

    .card-body {
      padding-top: 24px;
      padding-bottom: 0;
    }

    .card-footer {
      padding: 24px 0;
    }

    .additional {
      .btn {
        position: relative;
        margin-bottom: 10px;
        height: 48px;
        background: #f0f2fc;
        color: #4d536e;
        transition: all 0.2s;

        &:hover {
          background: #f9faff;
        }

        &:focus {
          box-shadow: none;
        }
      }

      .btn-unstyled {
        border: 0;
      }

      .logo {
        position: absolute;
        top: 50%;
        left: 15px;
        width: 16px;
        height: 16px;
        transform: translateY(-50%);
      }
    }

    .or {
      display: block;
      margin: 16px 0;
      color: #c6cbde;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.9px;
      font-weight: 700;
      font-size: 11px;
      line-height: 16px;
    }

    .form {
      .email,
      .password {
        padding-top: 12px;
        padding-bottom: 12px;
        height: 48px;
        border: 1px solid #e4e6f2;
        letter-spacing: 0.2px;

        &::placeholder {
          color: #c6cbde;
        }

        &.is-invalid {
          border-color: #dc3545;
        }

        &.is-valid {
          border-color: #28a745;
        }
      }

      ::v-deep.invalid-feedback {
        font-size: 1rem;
      }
    }

    .btn-login {
      height: 50px;
      border: 0;
      font-size: 18px;
      transition: all 0.2s;

      &:disabled {
        cursor: not-allowed;
      }

      .spinner-border {
        width: 1.5rem;
        height: 1.5rem;
        border-width: 0.15em;
      }
    }

    .create-account-callout {
      transition: color 0.1s;
    }
  }
}
</style>
