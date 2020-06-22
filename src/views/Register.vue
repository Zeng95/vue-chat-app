<template>
  <div class="register vh-100 d-flex flex-column justify-content-center">
    <b-jumbotron
      header="Real-Time Chat"
      header-level="4"
      lead="Powered by Vue.js & Firebase"
      text-variant="white"
      bg-variant="transparent"
      class="text-center mb-0 pt-0 pb-4"
    />

    <b-button class="btn-login" variant="transparent">
      <router-link :to="{ name: 'Login' }">Log in</router-link>
    </b-button>

    <b-card
      class="border-0 mx-auto"
      header-class="p-0 border-0 bg-transparent"
      body-class="px-5"
    >
      <template v-slot:header></template>

      <b-card-title title="Start Chatting Now" title-tag="h2" class="mb-0" />

      <b-card-sub-title
        sub-title="Let's create your account."
        sub-title-tag="p"
        class="text-center text-reset"
      />

      <!-- 第三方登录 -->
      <div class="additional">
        <!-- Twitter -->
        <b-button class="btn-unstyled flex-fill mr-2" @click="loginWithTwitter">
          <img
            class="logo"
            :src="require('@/assets/images/twitter_logo.svg')"
            alt="twitter"
          />
          <span>Twitter</span>
        </b-button>

        <!-- Google -->
        <b-button class="btn-unstyled flex-fill mr-2" @click="loginWithGoogle">
          <img
            class="logo"
            :src="require('@/assets/images/google_logo.svg')"
            alt="google"
          />
          <span>Google</span>
        </b-button>

        <!-- Github -->
        <b-button class="btn-unstyled flex-fill" @click="loginWithGithub">
          <img
            class="logo"
            :src="require('@/assets/images/github_logo.svg')"
            alt="github"
          />
          <span>Github</span>
        </b-button>
      </div>

      <span class="or">OR USE YOUR EMAIL TO REGISTER:</span>

      <!-- 表单 -->
      <b-form
        novalidate
        class="form"
        autocomplete="off"
        @submit.stop.prevent="registerWithEmailAndPwd"
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
            @focus="focusOnEmail"
          ></b-form-input>
        </b-form-group>

        <transition name="slide-down">
          <div v-if="inputFocusing">
            <!-- 密码 -->
            <b-form-group class="mb-4" invalid-feedback="At least 6 characters">
              <b-form-input
                trim
                type="password"
                placeholder="Password"
                class="password"
                :state="validateState('password')"
                v-model="$v.form.password.$model"
              ></b-form-input>
            </b-form-group>

            <!-- 用户名 -->
            <b-form-group class="mb-0" invalid-feedback="Username is required">
              <b-form-input
                trim
                type="text"
                placeholder="Username"
                class="username"
                :state="validateState('username')"
                v-model="$v.form.username.$model"
              ></b-form-input>
            </b-form-group>
          </div>
        </transition>

        <b-button
          block
          size="lg"
          type="submit"
          variant="primary"
          :disabled="$v.form.$invalid"
          class="btn-register d-flex justify-content-center align-items-center mt-4"
        >
          <b-spinner v-if="loadingShow" label="Loading..." />
          <span v-else>Register</span>
        </b-button>
      </b-form>
    </b-card>

    <b-toast id="register-toast" variant="info" solid no-auto-hide>
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
        password: '',
        username: ''
      },
      inputFocusing: false,

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
      },
      username: {
        required
      }
    }
  },
  methods: {
    ...mapActions('auth', [
      'signInWithTwitter',
      'signInWithGoogle',
      'signInWithGithub',
      'signUpWithEmailAndPwd'
    ]),
    focusOnEmail() {
      this.inputFocusing = true
    },
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name]

      return $dirty ? !$error : null
    },
    navigateToChat() {
      this.$router.push({ name: 'Chat' })
    },

    async loginWithTwitter() {
      try {
        this.$bvToast.show('register-toast')
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
        this.$bvToast.hide('register-toast')
      }
    },
    async loginWithGoogle() {
      try {
        this.$bvToast.show('register-toast')
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
        this.$bvToast.hide('register-toast')
      }
    },
    async loginWithGithub() {
      try {
        this.$bvToast.show('register-toast')
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
        this.$bvToast.hide('register-toast')
      }
    },
    async registerWithEmailAndPwd() {
      try {
        this.$v.form.$touch()

        if (this.$v.form.$anyError) {
          return false
        }

        this.loadingShow = true
        this.$bvToast.show('register-toast')

        await this.signUpWithEmailAndPwd({
          email: this.form.email,
          password: this.form.password,
          username: this.form.username
        })

        this.alertShow = true
        this.alertMessage = 'Register successfully.'
        this.alertVariant = 'success'

        this.navigateToChat()
      } catch (error) {
        this.alertShow = true
        this.alertMessage = error.message
        this.alertVariant = 'danger'
      } finally {
        this.loadingShow = false
        this.$bvToast.hide('register-toast')
      }
    }
  },
  beforeCreate() {
    this.$emit('ready')
  }
}
</script>

<style lang="scss" scoped>
.register {
  background: url('../assets/images/login-background.svg') no-repeat
    center/cover;
  color: #0e101a;
  font-family: Inter;

  .lead {
    margin-bottom: 0;
  }

  .btn-login {
    position: absolute;
    top: 25px;
    right: 24px;
    padding: 0;
    min-width: 70px;
    height: 32px;
    border: 0;
    font-weight: 700;
    line-height: 32px;

    &:focus {
      box-shadow: unset;
    }

    a {
      &:hover {
        text-decoration: none;
      }
    }
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

    .card-body {
      padding-top: 24px;
      padding-bottom: 24px;
    }

    .card-title {
      color: #2b2d38;
      text-align: center;
      font-weight: 600;
      line-height: 40px;
    }

    .card-subtitle {
      font-size: 16px;
      line-height: 28px;
    }

    .additional {
      display: flex;
      margin-top: 24px;

      .btn {
        display: flex;
        align-items: center;
        justify-content: center;
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
        margin-right: 8px;
        width: 16px;
        height: 16px;
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
      .password,
      .username {
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

    .btn-register {
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
  }

  .slide-down-enter-active,
  .slide-down-leave-active {
    overflow: hidden;
    height: 117px;
    transition: height 0.5s;
  }

  .slide-down-enter,
  .slide-down-leave-to {
    height: 0;
  }
}
</style>
