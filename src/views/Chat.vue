<template>
  <div v-if="asyncDataStatus_ready" class="vh-100">
    <ChatNavBar />

    <b-container fluid>
      <b-row>
        <b-col cols="3" xl="2">
          <ChannelList />

          <MemberList />
        </b-col>

        <b-col cols="9" xl="10">
          <MessageList />

          <MessageForm />
        </b-col>
      </b-row>
    </b-container>
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
