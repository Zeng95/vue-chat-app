<template>
  <div class="channel-list mb-5">
    <h4>Channels</h4>

    <hr />

    <b-button variant="outline-primary" @click="modalShow = !modalShow">
      Add Channel
    </b-button>

    <!-- Show the list of channels -->
    <b-list-group class="mt-3">
      <b-list-group-item
        v-for="channel in channels"
        :key="channel._id"
        :active="getActiveChannel(channel)"
        @click="setCurrentChannel(channel)"
      >
        <b-icon-hash />
        <span>{{ channel.name }}</span>
      </b-list-group-item>
    </b-list-group>

    <b-modal
      centered
      v-model="modalShow"
      title="BootstrapVue"
      cancel-variant="outline-secondary"
      @ok="addChannel"
    >
      <b-form class="form">
        <b-form-group class="mb-0">
          <b-form-input
            required
            v-model="newChannel"
            placeholder="Channel name"
            @keyup.enter="addChannel"
          ></b-form-input>
        </b-form-group>
      </b-form>
    </b-modal>

    <AppAlert
      :visible="alertShow"
      :message="alertMessage"
      :variant="alertVariant"
      @hideAlert="alertShow = !alertShow"
    />
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { BIconHash } from 'bootstrap-vue'
import AppAlert from '@/components/AppAlert'

export default {
  name: 'ChannelList',
  components: { BIconHash, AppAlert },
  computed: {
    ...mapState({ channels: state => Object.values(state.channels.items) }),
    ...mapGetters('channels', ['currentChannel'])
  },
  data() {
    return {
      newChannel: '',

      modalShow: false,

      alertShow: false,
      alertMessage: '',
      alertVariant: ''
    }
  },
  methods: {
    ...mapActions('channels', ['setCurrentChannel', 'createChannel']),

    async addChannel() {
      try {
        await this.createChannel(this.newChannel)

        this.alertShow = true
        this.alertMessage = 'Add successfully'
        this.alertVariant = 'success'
      } catch (error) {
        this.alertShow = true
        this.alertMessage = error.message
        this.alertVariant = 'danger'
      } finally {
        this.modalShow = false
        this.newChannel = ''
      }
    },

    getActiveChannel(channel) {
      return channel._id === this.currentChannel.id
    }
  }
}
</script>

<style lang="scss" scoped>
.list-group {
  overflow-y: scroll;
  height: 216px;

  .list-group-item {
    transition: all 0.2s;
  }
}
</style>
