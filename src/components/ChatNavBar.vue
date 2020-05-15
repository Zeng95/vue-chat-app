<template>
  <b-navbar id="chat-navbar" toggleable="md" type="dark" variant="primary">
    <b-navbar-brand href="#">
      Real-Time Chat
    </b-navbar-brand>
    <b-navbar-nav class="ml-auto">
      <b-nav-text>User |</b-nav-text>
      <b-nav-item href="#" active>Logout</b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
export default {
  name: 'ChatNavBar',
  methods: {
    logout() {
      console.log(1)
    }
  }
}
</script>

<style>
#chat-navbar {
  margin-bottom: 15px;
}
</style>
