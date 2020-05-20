<template>
  <div class="message">
    <small class="mb-4 d-block text-center text-muted">{{ date }}</small>

    <b-media
      no-body
      :class="{ 'justify-content-end': message.userId === authId }"
    >
      <b-media-aside v-if="message.userId !== authId" vertical-align="bottom">
        <b-avatar
          badge
          badge-variant="success"
          size="26"
          :src="users[message.userId].avatar"
        />
      </b-media-aside>

      <b-media-body
        class="d-inline-block rounded-pill border"
        :class="{ me: message.userId === authId }"
      >
        <p class="mb-0">
          {{ message.text }}
        </p>
      </b-media-body>
    </b-media>
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
  computed: {
    ...mapState({
      authId: state => state.auth.authId,
      users: state => state.users.items
    }),
    date() {
      const milliseconds = this.message.timestamp.seconds * 1000
      return moment(milliseconds).format('D MMMM, h:mm a')
    }
  }
}
</script>

<style lang="scss" scoped>
.message {
  &:not(:first-of-type) {
    margin-top: 1.5rem;
  }

  .media-body {
    flex: none;
    margin-left: 1rem;
    padding: 0.75rem 1rem;

    &.me {
      margin-right: 1rem;
      margin-left: 0;
      border: 0 !important;
      background-color: #f5f5f5;
    }
  }

  .user-typing {
    height: 1rem;
  }
}
</style>
