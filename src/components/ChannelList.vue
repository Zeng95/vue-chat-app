<template>
  <div class="channel-list mb-5">
    <b-navbar toggleable type="dark" variant="blue" class="px-0">
      <!-- Toggle -->
      <b-navbar-toggle
        target="collapse-channels"
        class="d-flex align-items-center p-0 pl-3 border-0"
      >
        <template v-slot:default="{ expanded }">
          <span class="icon-caret" :class="{ 'icon-caret-down': expanded }">
            <b-icon-caret-right-fill />
          </span>
          <span class="ml-1">Channels</span>
        </template>
      </b-navbar-toggle>

      <!-- Plus icon -->
      <b-button
        v-b-tooltip="{
          title: 'Add channels',
          trigger: 'hover',
          boundary: 'viewport'
        }"
        variant="transparent"
        class="icon-plus p-1 mr-3 border-0"
        @click="modalShow = !modalShow"
      >
        <b-icon-plus class="w-100 h-100" />
      </b-button>

      <!-- Collapse -->
      <b-collapse id="collapse-channels" is-nav>
        <b-navbar-nav>
          <b-nav-item
            link-classes="d-flex px-3"
            v-for="channel in channels"
            :key="channel._id"
            :active="getActiveChannel(channel)"
            @click.stop="setCurrentChannel(channel)"
          >
            <span class="icon-hash"><b-icon-hash /></span>
            <span>{{ channel.name }}</span>
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <b-modal
      centered
      v-model="modalShow"
      title="Modal Title"
      ok-title="Add"
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
import { BIconHash, BIconPlus, BIconCaretRightFill } from 'bootstrap-vue'
import AppAlert from '@/components/AppAlert'

export default {
  name: 'ChannelList',
  components: { BIconHash, BIconPlus, BIconCaretRightFill, AppAlert },
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
.channel-list {
  .navbar-toggler {
    font-size: 1rem;
  }

  .nav-link {
    &:hover,
    &:focus {
      background-color: var(--primary);
    }

    &.active {
      background-color: #3f0e40;
    }
  }

  .icon-caret {
    margin-left: -7px;
    width: 26px;
    height: 26px;
    line-height: 26px;
    transition: transform 0.1s;
    transform: translateY(-1px);

    &.icon-caret-down {
      transform: rotate(90deg) translateX(-1px);
    }

    .b-icon {
      font-size: 12px;
    }
  }

  .icon-plus {
    box-sizing: content-box;
    width: 24px;
    height: 24px;
    color: rgba(255, 255, 255, 0.5);
    cursor: pointer;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }

  .icon-hash {
    width: 20px;
    height: 20px;
  }
}
</style>
