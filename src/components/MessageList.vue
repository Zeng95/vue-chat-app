<template>
  <div class="message-list" v-chat-scroll="{ always: false, smooth: true }">
    <p class="nomessages text-secondary" v-if="messages.length === 0">
      [No messages yet!]
    </p>

    <div class="messages" v-else>
      <div v-if="!isPrivate" class="message-pane-foreword">
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

      <div v-for="message in messages" :key="message.label">
        <div>{{ message.label }}</div>

        <message-item
          v-for="(item, index) in message.items"
          :key="item._id"
          :message="item"
          :prevMessage="index === 0 ? item : message.items[index - 1]"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { BIconHash } from 'bootstrap-vue'
import moment from 'moment'
import MessageItem from './MessageListItem'

export default {
  name: 'MessageList',
  components: { MessageItem, BIconHash },
  computed: {
    ...mapState({
      isPrivate: state => state.channels.isPrivate,
      messages: state => {
        const itemsArr = Object.values(state.messages.items).sort((a, b) => {
          return a.timestamp.seconds - b.timestamp.seconds
        })
        const newArr = []

        itemsArr.forEach(message => {
          const milliseconds = message.timestamp.seconds * 1000
          const date = moment(milliseconds).format('dddd,MMMM Do')
          let labelAdded = false

          newArr.forEach((item, index) => {
            if (item.label === date) {
              newArr[index].items.push(message)
              labelAdded = true
            }
          })

          if (!labelAdded) {
            newArr.push({ label: date, items: [message] })
          }
        })

        return newArr
      }
    }),
    ...mapGetters('channels', ['currentChannel'])
  },
  methods: {
    ...mapActions('messages', [
      'fetchMessages',
      'fetchPrivateMessages',
      'clearMessagesLocally'
    ])
  },
  watch: {
    currentChannel() {
      console.log('channel changed')
      this.clearMessagesLocally()

      if (this.isPrivate) {
        this.fetchPrivateMessages()
      } else {
        this.fetchMessages()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.message-list {
  margin-bottom: 15px;

  .message-pane-foreword {
    margin: 48px 20px 16px 20px;
  }

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
