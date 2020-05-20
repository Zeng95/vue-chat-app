<template>
  <div class="user-list">
    <h4>Members</h4>

    <hr />

    <!-- Show the list of channels -->
    <b-list-group class="mt-3">
      <b-list-group-item v-for="user in users" :key="user._id">
        <span>{{ user.name }}</span>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'MemberList',
  computed: {
    ...mapState({
      users: state => {
        return Object.values(state.users.items).filter(
          user => user._id !== state.auth.authId
        )
      }
    })
  }
}
</script>

<style></style>
