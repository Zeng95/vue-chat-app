<template>
  <div class="message-list">
    <h4>Messages</h4>

    <hr />

    <div class="message-group" v-chat-scroll="{ always: false, smooth: true }">
      <transition name="fade" mode="out-in">
        <p class="nomessages text-secondary" v-if="messages.length === 0">
          [No messages yet!]
        </p>

        <div class="messages" v-else>
          <MessageItem
            v-for="message in messages"
            :key="message._id"
            :message="message"
          />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import MessageItem from './MessageItem'

export default {
  name: 'MessageList',
  components: { MessageItem },
  computed: {
    ...mapState({
      messages: state => {
        const itemsArr = Object.values(state.messages.items)

        // Use the slice() method to protect the original array from being modified
        return itemsArr
          .slice()
          .sort((a, b) => a.timestamp.seconds - b.timestamp.seconds)
      }
    }),
    ...mapGetters('channels', ['currentChannel'])
  },
  watch: {
    currentChannel() {
      this.clearMessagesLocally()
      this.fetchMessages()
    }
  },
  methods: {
    ...mapActions('messages', ['fetchMessages', 'clearMessagesLocally'])
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

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
