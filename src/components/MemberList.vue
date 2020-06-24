<template>
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
      <b-collapse id="collapse-members" is-nav :visible="true">
        <b-navbar-nav>
          <b-nav-item
            link-classes="sidebar-channel px-4 py-0"
            v-for="user in filteredUsers"
            :key="user._id"
            :active="isActive(user)"
            @click.stop="changeChanel(user)"
          >
            <div class="d-flex align-items-center">
              <span class="icon-circle">
                <b-icon-circle />
              </span>
              <span class="name">{{ user.username }}</span>
            </div>

            <!-- Status -->
            <div class="status">
              <b-badge pill :variant="getVariantByStatus(user.status)">
                {{ user.status }}
              </b-badge>
            </div>
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
import { mapState, mapGetters, mapActions } from 'vuex'
import { BIconPlus, BIconCircle, BIconCaretRightFill } from 'bootstrap-vue'
import AppAlert from '@/components/AppAlert'
import { realtimeDB } from '@/firebase.config'

export default {
  name: 'MemberList',
  components: {
    BIconPlus,
    BIconCircle,
    BIconCaretRightFill,
    AppAlert
  },
  computed: {
    ...mapState({
      users: state => state.users.items,
      authId: state => state.auth.authId
    }),
    ...mapGetters('channels', ['currentChannel']),
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
    ...mapActions('users', ['updateUserStatus', 'setSender']),
    ...mapActions('channels', ['setPrivate', 'setCurrentChannel']),
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
    isActive(user) {
      return this.getChannelId(user._id) === this.currentChannel._id
    },
    changeChanel(user) {
      const channelId = this.getChannelId(user._id)
      const channel = { _id: channelId, name: user.username }
      const sender = this.users[user._id]

      this.setPrivate(true)
      this.setCurrentChannel(channel)
      this.setSender(sender)
    },
    getChannelId(userId) {
      // smallerUserId < biggerUserId
      return `${this.authId}/${userId}`
    },
    getVariantByStatus(status) {
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 28px;
  }

  .nav-link {
    &:hover,
    &:focus {
      background-color: var(--primary);
    }

    &.active {
      background-color: var(--light);
      color: var(--dark);
    }
  }

  .icon-caret {
    margin-left: -7px;
    width: 26px;
    height: 26px;
    line-height: 26px;
    transition: transform 0.1s;
    transform: translateY(-1px);

    &.icon-caret-down {
      transform: rotate(90deg) translateX(-1px);
    }

    .b-icon {
      font-size: 12px;
    }
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
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;

    > .b-icon {
      font-size: 0.65rem;
    }
  }

  .name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1;
  }

  .status {
    line-height: 1;
  }
}
</style>
