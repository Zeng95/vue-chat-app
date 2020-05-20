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
    this.$store
      .dispatch('channels/fetchChannels')
      .then(channels => {
        return Promise.all(
          channels.map(channel => {
            const messages = channel.messages || {}

            return this.$store.dispatch('messages/fetchMessages', {
              ids: messages
            })
          })
        )
      })
      .then(messagesArray => {
        return Promise.all(
          messagesArray.map(messages => {
            const users = {}

            messages.forEach(message => {
              users[message.userId] = message.userId
            })

            return this.$store.dispatch('users/fetchUsers', { ids: users })
          })
        )
      })
      .then(() => this.asyncDataStatus_fetched())
  }
}
</script>
