<template>
  <b-navbar class="mb-3" toggleable="md" type="dark" variant="primary">
    <b-navbar-brand tag="h1" class="m-0 py-0 d-flex align-items-center">
      <b-img src="../assets/images/logo.png" alt="logo" class="logo" />
      <span class="ml-2">Real-Time Chat</span>
    </b-navbar-brand>

    <b-navbar-nav class="ml-auto align-items-center">
      <b-nav-text class="d-flex align-items-center">
        <span class="mr-2">{{ currentUser.name }}</span>
        <b-avatar :src="currentUser.avatar" class="mr-2" />|
      </b-nav-text>
      <b-nav-item :to="{ name: 'Logout' }" active>Logout</b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ChatNavBar',
  computed: {
    ...mapGetters('users', ['currentUser'])
  }
}
</script>

<style lang="scss" scoped>
.logo {
  width: 35px;
  height: 35px;
}
</style>
