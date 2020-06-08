<template>
  <div class="message px-4 py-2">
    <b-media no-body>
      <b-media-aside class="mr-2" vertical-align="center">
        <a href="#" class="avatar" @click="showModal">
          <b-avatar rounded="sm" :src="users[message.userId].avatar" />
        </a>
      </b-media-aside>

      <b-media-body class="text-muted">
        <!-- 发送人 -->
        <a href="#" class="sender mr-2" @click="showModal">
          <span>{{ users[message.userId].name }}</span>
        </a>

        <!-- 时间 -->
        <a
          href="#"
          v-b-tooltip.hover
          class="timestamp text-reset"
          :title="`Today at ${timeWithSeconds}`"
        >
          <time>{{ timeWithoutSeconds }}</time>
        </a>

        <!-- 内容 -->
        <div class="mb-0" v-html="message.content"></div>
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
        :img-src="users[message.userId].avatar"
        img-alt="Profile photo"
        body-class="p-0"
        class="member-profile-card w-100 border-0"
      >
        <div class="name p-3">
          <a href="#">
            <span>{{ users[message.userId].name }}</span>
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
  name: 'MessageItem',
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      modalShow: false,

      now: '',
      milliseconds: this.message.timestamp.seconds * 1000
    }
  },
  computed: {
    ...mapState({
      authId: state => state.auth.authId,
      users: state => state.users.items
    }),
    timeWithSeconds() {
      return moment(this.milliseconds).format('LTS')
    },
    timeWithoutSeconds() {
      return moment(this.milliseconds).format('LT')
    }
  },
  methods: {
    showModal() {
      this.modalShow = true
    },
    showCurrentTime() {
      this.now = moment().format('LT')
    },
    changeChannel() {
      console.log(1)
    },
    getChannelId() {}
  },
  mounted() {
    this.timer = setInterval(this.showCurrentTime, 1000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  }
}
</script>

<style lang="scss" scoped>
.message {
  &:hover {
    background-color: var(--light-gray);
  }

  .sender {
    color: rgb(29, 28, 29);
    font-weight: 900;
  }

  .timestamp {
    font-size: 12px;
  }
}
</style>
