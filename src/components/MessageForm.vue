<template>
  <div class="message-form">
    <small class="text-muted">@user</small>

    <b-form autocomplete="off" @submit.prevent="createMessage">
      <div class="ld ld-ring ld-spin"></div>

      <b-alert variant="danger" :show="hasError">{{ error }} </b-alert>

      <b-input-group>
        <b-form-input v-model="message" placeholder="Message..." />

        <b-input-group-append>
          <b-btn type="submit" variant="primary">Send</b-btn>
          <b-btn variant="warning" class="text-white">Upload</b-btn>
        </b-input-group-append>
      </b-input-group>
    </b-form>
  </div>
</template>

<script>
import { database } from '@/firebase.config'

export default {
  name: 'MessageForm',
  props: {
    username: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      message: ''
    }
  },
  methods: {
    async createMessage() {
      try {
        const result = database.collection('messages').add({
          message: this.message,
          username: this.username,
          timestamp: Date.now()
        })

        console.log('Document written with ID: ', result.id)

        this.message = null
      } catch (error) {
        console.error('Error adding document: ', error)
      }
    }
  }
}
</script>
