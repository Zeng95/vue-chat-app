<template>
  <transition name="fade">
    <b-alert
      v-if="isShow"
      class="position-fixed d-flex align-items-center"
      :class="classObject"
      fade
      dismissible
      :variant="variant"
      :show="dismissCountDown"
      @dismissed="hideAlert"
      @dismiss-count-down="countDownChanged"
    >
      <div class="mr-2">
        <b-icon-x-circle-fill v-if="variant === 'danger'" />
        <b-icon-check
          v-if="variant === 'success'"
          variant="white"
          class="rounded-circle bg-success"
        />
      </div>

      <p class="mb-0 text-truncate">{{ message }}</p>
    </b-alert>
  </transition>
</template>

<script>
import { BIconXCircleFill, BIconCheck } from 'bootstrap-vue'
export default {
  components: {
    BIconCheck,
    BIconXCircleFill
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      required: true
    },
    variant: {
      type: String,
      default: 'success'
    }
  },
  computed: {
    classObject() {
      return {
        'text-green': this.variant === 'success',
        'text-red': this.variant === 'danger'
      }
    }
  },
  data() {
    return {
      dismissSecs: 5,
      dismissCountDown: 0
    }
  },
  methods: {
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs
    },
    hideAlert() {
      this.dismissCountDown = 0
      this.$emit('hideAlert')
    }
  },
  watch: {
    isShow(val) {
      if (val) {
        this.showAlert()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.alert {
  top: 20px;
  left: 50%;
  z-index: 1000;
  transform: translate3d(-50%, 0, 0);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, top 0.4s;
}

.fade-enter,
.fade-leave-to {
  top: 0;
  opacity: 0;
}
</style>
