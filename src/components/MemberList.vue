<template>
  <!-- <div class="user-list">
    <h4>Members</h4>

    <hr />

    <b-list-group class="mt-3">
      <b-list-group-item
        v-for="user in filteredUsers"
        :key="user._id"
        class="d-flex justify-content-between align-items-center"
      >
        <b-avatar :src="user.avatar" v-if="showUserAvater"></b-avatar>
        <a href="#">
          <span>{{ user.name }}</span>
        </a>
        <b-badge :variant="statusColor(user.status)" pill>
          {{ user.status }}
        </b-badge>
      </b-list-group-item>
    </b-list-group>
  </div> -->

  <div class="member-list mb-5">
    <b-navbar toggleable type="dark" variant="blue" class="px-0">
      <!-- Toggle -->
      <b-navbar-toggle
        target="collapse-members"
        class="d-flex align-items-center p-0 pl-3 border-0"
      >
        <template v-slot:default="{ expanded }">
          <span class="icon-caret" :class="{ 'icon-caret-down': expanded }">
            <b-icon-caret-right-fill />
          </span>
          <span class="ml-1">Direct messages</span>
        </template>
      </b-navbar-toggle>

      <!-- Plus icon -->
      <b-button
        v-b-tooltip="{
          title: 'Open a direct message',
          trigger: 'hover',
          boundary: 'viewport'
        }"
        variant="transparent"
        class="icon-plus p-1 mr-3 border-0"
        @click="modalShow = !modalShow"
      >
        <b-icon-plus class="w-100 h-100" />
      </b-button>

      <!-- Collapse -->
      <b-collapse id="collapse-members" is-nav>
        <b-navbar-nav>
          <b-nav-item
            link-classes="sidebar-channel d-flex align-items-center px-3 py-0"
            v-for="user in filteredUsers"
            :key="user._id"
          >
            <span class="icon-circle"><b-icon-circle /></span>
            <span class="name">{{ user.name }}</span>
            <b-badge pill>{{ user.status }}</b-badge>
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <AppAlert
      :visible="alertShow"
      :message="alertMessage"
      :variant="alertVariant"
      @hideAlert="alertShow = !alertShow"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { BIconPlus, BIconCircle, BIconCaretRightFill } from 'bootstrap-vue'
import AppAlert from '@/components/AppAlert'
import { realtimeDB } from '@/firebase.config'

export default {
  name: 'MemberList',
  components: { BIconPlus, BIconCircle, BIconCaretRightFill, AppAlert },
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
      windowWidth: window.innerWidth,

      modalShow: false,

      alertShow: false,
      alertMessage: '',
      alertVariant: ''
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
        console.log(snapshot)
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

<style lang="scss" scoped>
.member-list {
  .navbar-toggler {
    font-size: 1rem;
  }

  .sidebar-channel {
    height: 28px;
    line-height: 28px;
    opacity: 0.64;
  }

  .icon-plus {
    box-sizing: content-box;
    width: 24px;
    height: 24px;
    color: rgba(255, 255, 255, 0.5);
    cursor: pointer;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }

  .icon-circle {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1px;
    width: 20px;
    height: 20px;

    > .b-icon {
      font-size: 0.65rem;
    }
  }
}
</style>
