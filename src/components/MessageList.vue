<template>
  <div class="message-list">
    <h4>Messages</h4>

    <hr />

    <div class="message-group" v-chat-scroll="{ smooth: true }">
      <p class="nomessages text-secondary" v-if="messages.length === 0">
        [No messages yet!]
      </p>

      <div
        class="message rounded mb-3"
        v-for="message in messages"
        :key="message.id"
      >
        <small class="d-block text-right text-info">
          @{{ message.username }}
        </small>

        <p class="mb-0">
          {{ message.text }}
        </p>

        <small class="d-block text-right text-muted">{{ message.date }}</small>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageList',
  props: {
    messages: {
      type: Array,
      required: true
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

  .message {
    padding: 10px;
    border: 1px solid lightblue;

    .message-title {
      display: inline;
      font-size: 1rem;
    }

    .user-typing {
      height: 1rem;
    }
  }
}
</style>
