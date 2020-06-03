<template>
  <div v-if="asyncDataStatus_ready" class="vh-100">
    <ChatNavBar />

    <div>
      <b-sidebar
        visible
        no-header
        no-header-close
        width="260px"
        sidebar-class="sidebar"
        bg-variant="blue"
      >
        <ChannelList />

        <MemberList />
      </b-sidebar>

      <div role="main" class="contents ml-auto">
        <div>
          <b-jumbotron
            header="BootstrapVue"
            lead="Bootstrap v4 Components for Vue.js 2"
          >
            <p>For more information visit website</p>
            <b-button variant="primary" href="#">More Info</b-button>
          </b-jumbotron>

          <MessageList />
        </div>

        <footer class="footer">
          <MessageForm />
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import ChatNavBar from '@/components/ChatNavBar'
import ChannelList from '@/components/ChannelList'
import MessageList from '@/components/MessageList'
import MessageForm from '@/components/MessageForm'
import MemberList from '@/components/MemberList'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  name: 'Chat',
  mixins: [asyncDataStatus],
  components: {
    ChatNavBar,
    ChannelList,
    MessageList,
    MessageForm,
    MemberList
  },
  async beforeCreate() {
    await this.$store.dispatch('channels/fetchChannels')
    await this.$store.dispatch('messages/fetchMessages')
    await this.$store.dispatch('users/fetchUsers')

    this.asyncDataStatus_fetched()
  }
}
</script>

<style lang="scss">
.sidebar {
  top: auto;
  bottom: 0;
  height: calc(100% - 63px) !important;
}

.contents {
  width: calc(100% - 260px);
}
</style>
