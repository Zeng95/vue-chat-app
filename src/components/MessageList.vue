<template>
  <div class="message-list" v-chat-scroll="{ always: false, smooth: true }">
    <p class="nomessages text-secondary" v-if="messages.length === 0">
      [No messages yet!]
    </p>

    <div class="messages" v-else>
      <div v-if="!isPrivate">
        <!-- Channel name -->
        <h1>
          <span class="icon-hash">
            <b-icon-hash />
          </span>

          <span>{{ currentChannel.name }}</span>
        </h1>

        <!-- 段落 -->
        <p>
          You created this channel today. This is the very beginning of the
          <strong>
            <span class="icon-hash"><b-icon-hash /></span>
            <span>{{ currentChannel.name }}</span>
          </strong>
          channel.
        </p>

        <!-- 按钮 -->
        <div>
          <b-button variant="transparent">Add description</b-button>
          <b-button variant="transparent">Add people</b-button>
        </div>
      </div>

      <MessageItem
        v-for="message in messages"
        :key="message._id"
        :message="message"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import MessageItem from './MessageItem'
import { BIconHash } from 'bootstrap-vue'

export default {
  name: 'MessageList',
  components: { MessageItem, BIconHash },
  computed: {
    ...mapState({
      isPrivate: state => state.channels.isPrivate,
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
  methods: {
    ...mapActions('messages', ['fetchMessages', 'clearMessagesLocally'])
  },
  watch: {
    currentChannel() {
      console.log('channel changed')
      // this.clearMessagesLocally()
      // this.fetchMessages()
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
