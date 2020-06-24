<template>
  <transition name="fade">
    <b-alert
      fade
      dismissible
      v-if="visible"
      :variant="variant"
      :show="dismissCountDown"
      @dismissed="hideAlert"
      @dismiss-count-down="changeCountDown"
    >
      <div class="mr-2">
        <b-icon-x-circle-fill v-if="variant === 'danger'" />
        <b-icon-check
          v-if="variant === 'success'"
          class="rounded-circle bg-success text-white"
        />
      </div>

      <p class="mb-0 text-truncate">{{ message }}</p>
    </b-alert>
  </transition>
</template>

<script>
import { BIconXCircleFill, BIconCheck } from 'bootstrap-vue'
export default {
  name: 'AppAlert',
  components: {
    BIconCheck,
    BIconXCircleFill
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    variant: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      dismissSecs: 5,
      dismissCountDown: 0
    }
  },
  methods: {
    changeCountDown(dismissCountDown) {
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
    visible(val) {
      if (val) this.showAlert()
    }
  }
}
</script>

<style lang="scss" scoped>
.alert {
  position: fixed;
  top: 40px;
  left: 50%;
  z-index: 1000;
  display: flex;
  align-items: center;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.1);
  transform: translate3d(-50%, 0, 0);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s;
}

.fade-enter,
.fade-leave-to {
  top: 0;
  opacity: 0;
}
</style>
