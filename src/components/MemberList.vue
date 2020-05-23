<template>
  <div class="user-list">
    <h4>Members</h4>

    <hr />

    <!-- Show the list of channels -->
    <b-list-group class="mt-3">
      <b-list-group-item
        v-for="user in filteredUsers"
        :key="user._id"
        class="d-flex justify-content-between align-items-center"
      >
        <b-avatar :src="user.avatar" v-if="showUserAvater"></b-avatar>
        <span>{{ user.name }}</span>
        <b-badge :variant="statusColor(user.status)" pill>
          {{ user.status }}
        </b-badge>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { realtimeDB } from '@/firebase.config'

export default {
  name: 'MemberList',
  computed: {
    ...mapState({
      users: state => state.users.items,
      authId: state => state.auth.authId
    }),
    filteredUsers() {
      return Object.values(this.users).filter(user => user._id !== this.authId)
    },
    showUserAvater() {
      return this.windowWidth > 1500
    }
  },
  data() {
    return {
      userStatusRef: realtimeDB.ref('status'),
      windowWidth: window.innerWidth
    }
  },
  methods: {
    ...mapActions('auth', [
      'disconnect',
      'setOnlineStatus',
      'setOfflineStatus'
    ]),
    ...mapActions('users', ['updateUserStatus']),
    addListeners() {
      this.userStatusRef.on('child_added', snapshot => {
        if (snapshot.key !== this.authId) {
          this.updateUserStatus({
            userId: snapshot.key,
            status: snapshot.val().state
          })
        }
      })

      this.userStatusRef.on('child_changed', snapshot => {
        if (snapshot.key !== this.authId) {
          this.updateUserStatus({
            userId: snapshot.key,
            status: snapshot.val().state
          })
        }
      })
    },
    // 用户状态对应的背景颜色
    statusColor(status) {
      return status === 'online' ? 'success' : 'warning'
    }
  },
  created() {
    this.addListeners()

    window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth
    })
  }
}
</script>
