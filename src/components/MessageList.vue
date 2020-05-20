<template>
  <div class="message-list">
    <h4>Messages</h4>

    <hr />

    <div class="message-group" v-chat-scroll="{ always: false, smooth: true }">
      <p class="nomessages text-secondary" v-if="messages.length === 0">
        [No messages yet!]
      </p>

      <MessageItem
        v-else
        v-for="message in messages"
        :key="message._id"
        :message="message"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MessageItem from './MessageItem'

export default {
  name: 'MessageList',
  components: { MessageItem },
  computed: {
    ...mapState({
      messages: state => state.messages.items
    })
  },
  watch: {
    currentChannel(val) {
      console.log(val)
    }
  }
}
</script>

<style lang="scss" scoped>
.message-list {
  margin-bottom: 15px;

  .message-group {
    overflow-y: scroll;
    height: 65vh !important;
  }
}
</style>
