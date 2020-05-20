<template>
  <div class="user-list">
    <h4>Members</h4>
    <hr />
  </div>
</template>

<script>
import { database } from '@/firebase.config'
import { mapGetters } from 'vuex'

export default {
  name: 'MemberList',
  data() {
    return {
      users: [],
      usersRef: database.collection('users')
    }
  },
  computed: {
    ...mapGetters('channels', ['currentChannel'])
  }
}
</script>

<style></style>
