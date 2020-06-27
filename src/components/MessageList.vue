<template>
  <div class="message-list">
    <div class="messages">
      <div v-if="!isPrivate" class="pane-foreword">
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

      <div v-else class="pane-foreword">
        <div class="avatar">
          <b-button class="btn-sender btn-unstyled" variant="transparent">
            <b-avatar rounded size="56px" :src="currentSender.avatar" />

            <div>
              <div class="username font-weight-bold">
                <span>{{ currentSender.username }}</span>
                <span class="icon-presence">
                  <b-icon-circle
                    font-scale="0.6"
                    class="border border-dark rounded-circle"
                  />
                </span>
              </div>
              <div class="name">{{ currentSender.name }}</div>
            </div>
          </b-button>
        </div>

        <div class="description">
          <p class="d-flex align-items-center">
            This is the very beginning of your direct message history with
            <b-button class="btn-mention btn-unstyled" variant="transparent">
              @{{ currentSender.username }}
            </b-button>
          </p>
        </div>
      </div>

      <div v-for="message in messages" :key="message.label">
        <div class="position-relative">
          <b-button
            pill
            variant="transparent"
            class="divider-label-pill btn-unstyled bg-white"
          >
            {{ showLabel(message.label) }}
          </b-button>

          <div class="divider">
            <hr class="divider-line m-0" />
          </div>
        </div>

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
import { BIconHash, BIconCircle } from 'bootstrap-vue'
import moment from 'moment'
import MessageItem from './MessageListItem'

export default {
  name: 'MessageList',
  components: { MessageItem, BIconHash, BIconCircle },
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
          const date = moment(milliseconds).format('dddd, MMMM Do')
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
    ...mapGetters('channels', ['currentChannel']),
    ...mapGetters('users', ['currentSender'])
  },
  methods: {
    ...mapActions('messages', [
      'fetchMessages',
      'fetchPrivateMessages',
      'clearMessagesLocally'
    ]),
    showLabel(value) {
      const today = moment().format('dddd, MMMM Do')
      const yesterday = moment().add(-1, 'days').format('dddd, MMMM Do')

      if (value === today) {
        return 'Today'
      } else if (value === yesterday) {
        return 'Yesterday'
      } else {
        return value
      }
    }
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
  width: 100%;

  .pane-foreword {
    margin: 48px 20px 16px 20px;

    .avatar {
      margin-bottom: 16px;

      .btn-sender {
        display: flex;
        align-items: center;
      }

      .username,
      .name {
        padding-left: 12px;
        line-height: 18px;
      }

      .username {
        display: flex;
        align-items: baseline;
        color: var(--dark-magenta);
      }

      .name {
        color: var(--dark-grayish-magenta);
      }

      .icon-presence {
        display: inline-flex;
        justify-content: center;
        width: 20px;
      }
    }

    .description {
      color: var(--dark-magenta);
      font-size: 1.1rem;
      line-height: 1.5;

      .btn-mention {
        padding: 0 2px 1px 2px;
        border-radius: 3px;
        background: rgba(29, 155, 209, 0.1);
        color: rgba(18, 100, 163, 1);
      }
    }
  }

  .divider-label-pill {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 100;
    padding: 0 16px;
    height: 28px;
    border-radius: 24px;
    box-shadow: 0 0 0 1px rgba(29, 28, 29, 0.13),
      0 1px 3px 0 rgba(0, 0, 0, 0.08);
    color: var(--dark-magenta);
    font-weight: 700;
    font-size: 13px;
    transform: translate3d(-50%, -50%, 0);
  }

  .divider {
    position: relative;
    padding: 20px 0;
  }

  .divider-line {
    position: absolute;
    right: 0;
    left: 0;
    margin-top: -1px !important;
    border-top: 1px solid rgb(221, 221, 221);
  }
}
</style>
