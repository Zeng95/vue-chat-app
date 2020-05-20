<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view @ready="pageReady" />
    </transition>
  </div>
</template>

<script>
import NProgress from 'nprogress'

export default {
  methods: {
    pageReady() {
      NProgress.done()
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/custom.scss';
@import '~bootstrap/scss/bootstrap.scss';
@import '~bootstrap-vue/src/index.scss';

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

html {
  font-size: 0.875rem;
}

::-webkit-scrollbar {
  display: none;
}

button {
  &:focus {
    outline: none;
  }
}
</style>
