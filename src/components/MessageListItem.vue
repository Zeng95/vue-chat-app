<template>
  <div class="message px-4 py-2">
    <b-media no-body>
      <b-media-aside
        v-if="isMoreThan15Mins"
        class="mr-2"
        vertical-align="center"
      >
        <a href="#" class="avatar" @click="showModal">
          <b-avatar rounded="sm" :src="users[message.authorId].avatar" />
        </a>
      </b-media-aside>

      <b-media-body>
        <!-- 发送间隔超过 15 分钟 -->
        <div v-if="isMoreThan15Mins">
          <!-- 发送人 -->
          <a class="sender mr-2" href="#" @click="showModal">
            <span>{{ users[message.authorId].name }}</span>
          </a>

          <!-- 时间 -->
          <a
            class="timestamp text-dark-grayish-magenta"
            href="#"
            v-b-tooltip.hover
            :title="timeAndDate"
          >
            <time>{{ timeWithoutSeconds }}</time>
          </a>

          <!-- 内容 -->
          <div v-html="message.body"></div>
        </div>

        <div v-else class="d-flex">
          <!-- 时间 -->
          <div class="message-timestamp mr-2 text-right">
            <a
              class="timestamp text-dark-grayish-magenta"
              href="#"
              v-b-tooltip.hover
              :title="timeAndDate"
            >
              <time>{{ timeWithoutSecondsAndPeriod }}</time>
            </a>
          </div>

          <!-- 内容 -->
          <div class="flex-grow-1" v-html="message.body"></div>
        </div>
      </b-media-body>
    </b-media>

    <b-modal
      lazy
      static
      centered
      v-model="modalShow"
      hide-backdrop
      hide-header
      hide-footer
      size="sm"
      dialog-class=""
      content-class="border-0"
      body-class="p-0"
    >
      <b-card
        img-top
        img-height="260"
        :img-src="users[message.authorId].avatar"
        img-alt="Profile photo"
        body-class="p-0"
        class="member-profile-card w-100 border-0"
      >
        <div class="name p-3">
          <a href="#">
            <span>{{ users[message.authorId].name }}</span>
          </a>
        </div>

        <a class="full-profile-link d-block" href="#">View full profile</a>

        <div class="field">
          <div class="label">Local time</div>
          <div class="value">{{ now }}</div>
        </div>

        <div class="buttons d-flex px-3 pb-3">
          <b-button
            variant="outline-secondary"
            class="w-50"
            @click="changeChannel"
          >
            Message
          </b-button>
          <b-button variant="outline-secondary" class="w-50 ml-3">
            Call
          </b-button>
        </div>
      </b-card>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  name: 'MessageListItem',
  props: {
    message: {
      type: Object,
      required: true
    },
    prevMessage: {
      type: Object
    }
  },
  data() {
    return {
      now: '',
      milliseconds: this.message.timestamp.seconds * 1000,

      modalShow: false
    }
  },
  computed: {
    ...mapState({
      authId: state => state.auth.authId,
      users: state => state.users.items
    }),
    timeAndDate() {
      return moment(this.milliseconds).calendar()
    },
    timeWithoutSeconds() {
      return moment(this.milliseconds).format('LT')
    },
    timeWithoutSecondsAndPeriod() {
      return moment(this.milliseconds).format('h:mm')
    },
    isMoreThan15Mins() {
      const maximum = 15 * 60
      const difference =
        this.message.timestamp.seconds - this.prevMessage.timestamp.seconds

      if (difference !== 0) {
        return difference > maximum
      } else {
        return true
      }
    }
  },
  methods: {
    showModal() {
      this.modalShow = true
    },
    changeChannel() {
      console.log(1)
    },
    getChannelId() {}
  }
}
</script>

<style lang="scss" scoped>
.message {
  &:hover {
    background-color: var(--light-gray);

    .message-timestamp {
      opacity: 1;
    }
  }

  .message-timestamp {
    margin-left: -21px;
    width: 56px;
    opacity: 0;
  }

  .sender {
    color: var(--dark-magenta);
    font-weight: 900;
  }

  .timestamp {
    font-size: 12px;
  }
}
</style>
