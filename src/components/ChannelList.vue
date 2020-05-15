<template>
  <div class="channel-list">
    <h4>Channels</h4>

    <hr />

    <b-button variant="outline-primary" @click="modalShow = !modalShow">
      Add Channel
    </b-button>

    <!-- Show list of channes -->
    <b-list-group class="mt-4">
      <b-list-group-item
        class="channel"
        v-for="channel in channels"
        :key="channel.name"
        :active="setActiveChannel(channel)"
        @click="changeChannel(channel)"
      >
        {{ channel.name }}
      </b-list-group-item>
    </b-list-group>

    <!-- Modal -->
    <b-modal
      centered
      v-model="modalShow"
      title="BootstrapVue"
      cancel-variant="outline-secondary"
      ok-title="Add Channel"
      @ok="addChannel"
    >
      <b-form class="form">
        <b-form-group class="mb-0">
          <b-form-input
            required
            v-model="form.newChannel"
            placeholder="Channel name"
            @keyup.enter="addChannel"
          ></b-form-input>
        </b-form-group>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import { database } from '@/firebase.config'
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters('channel', ['currentChannel'])
  },
  data() {
    return {
      form: {
        newChannel: ''
      },
      // channels in 本地
      channels: [],
      // channels in Cloud Firestore
      channelsRef: database.collection('channels'),

      modalShow: false
    }
  },
  methods: {
    ...mapActions('channel', ['setCurrentChannel']),

    async addChannel() {
      try {
        const result = await this.channelsRef.add({
          name: this.form.newChannel
        })

        this.setCurrentChannel(result)

        this.modalShow = false
        this.form.newChannel = ''
      } catch (error) {
        console.log(error)
      }
    },

    // Change the currently active selection while clicking on the different channels
    changeChannel(channel) {
      this.setCurrentChannel(channel)
    },

    // Set the active prop to indicate the currently active selection.
    setActiveChannel(channel) {
      return channel.id === this.currentChannel.id
    },

    addListeners() {
      this.unsubscribe = this.channelsRef.onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type == 'added') {
            let doc = change.doc
            this.channels.push({
              id: doc.id,
              name: doc.data().name
            })
          }
        })

        // Set the current channel
        if (this.channels.length > 0) {
          // Set the first one as the current channel
          this.setCurrentChannel(this.channels[0])
        }
      })
    },

    detachListeners() {
      this.unsubscribe()
    }
  },
  created() {
    this.addListeners()
  }
}
</script>

<style lang="scss" scoped>
.channel {
  transition: all 0.2s;
}
</style>
