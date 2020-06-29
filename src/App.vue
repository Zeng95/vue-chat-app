<template>
  <div id="app">
    <transition name="fade" mode="out-in" v-show="showPage">
      <router-view @ready="pageReady" />
    </transition>

    <AppSpinner v-show="!showPage" />
  </div>
</template>

<script>
import AppSpinner from '@/components/AppSpinner'
import NProgress from 'nprogress' // progress bar

export default {
  name: 'App',
  components: {
    AppSpinner
  },
  data() {
    return {
      showPage: false
    }
  },
  methods: {
    pageReady() {
      this.showPage = true
      NProgress.done()
    }
  },
  created() {
    this.$router.beforeEach((to, from, next) => {
      this.showPage = false
      next()
    })
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/custom.scss';
@import '@/assets/scss/modal.scss';
@import '@/assets/scss/popover.scss';
@import '~bootstrap/scss/bootstrap.scss';
@import '~bootstrap-vue/src/index.scss';

html {
  font-size: 15px;

  -webkit-font-smoothing: antialiased;
}

body {
  color: rgb(29, 28, 29);
}

:focus {
  outline: none !important;
}

p {
  margin: 0;
}

.btn-unstyled {
  padding: 0;
  border: 0;
}

#nprogress .bar {
  background: var(--primary) !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.tooltip {
  top: 0;
}

.collapsing {
  transition: height 0.2s ease-out;
}
</style>
