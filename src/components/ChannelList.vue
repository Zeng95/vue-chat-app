<template>
  <div class="channel-list">
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
        id="popover-target-1"
        v-b-tooltip="{
          title: 'Add channels',
          trigger: 'hover',
          boundary: 'viewport'
        }"
        variant="transparent"
        class="icon-plus p-1 mr-3 border-0"
      >
        <b-icon-plus class="w-100 h-100" />
      </b-button>

      <b-popover
        target="popover-target-1"
        triggers="focus"
        placement="bottomright"
        boundary="viewport"
        custom-class="menu mt-0 border-0"
      >
        <b-list-group tag="ul" flush>
          <b-list-group-item tag="li" class="p-0 border-bottom-0">
            <b-button
              variant="light-gray"
              class="btn-menu-item px-4 py-0 border-0 w-100 rounded-0"
            >
              Browse channels
            </b-button>
          </b-list-group-item>
          <b-list-group-item tag="li" class="p-0">
            <b-button
              variant="light-gray"
              class="btn-menu-item px-4 py-0 border-0 w-100 rounded-0"
              @click="modalShow = !modalShow"
            >
              Create a channel
            </b-button>
          </b-list-group-item>
        </b-list-group>
      </b-popover>

      <!-- Collapse -->
      <b-collapse id="collapse-channels" is-nav :visible="true">
        <b-navbar-nav>
          <b-nav-item
            link-classes="sidebar-channel px-4 py-0"
            v-for="channel in channels"
            :key="channel._id"
            :active="getActiveChannel(channel)"
            @click.stop="changeChannel(channel)"
          >
            <div class="d-flex align-items-center">
              <span class="icon-hash">
                <b-icon-hash />
              </span>

              <span>{{ channel.name }}</span>
            </div>
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
    ...mapActions('channels', [
      'setPrivate',
      'setCurrentChannel',
      'createChannel'
    ]),
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
    },
    changeChannel(channel) {
      this.setPrivate(false)
      this.setCurrentChannel(channel)
    }
  }
}
</script>

<style lang="scss" scoped>
.channel-list {
  .navbar-toggler {
    font-size: 1rem;
  }

  .sidebar-channel {
    height: 28px;
    line-height: 28px;
  }

  .nav-link {
    &:hover,
    &:focus {
      background-color: var(--primary);
    }

    &.active {
      background-color: var(--light);
      color: var(--dark);
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
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: auto;

    .b-icon {
      font-size: 1rem;
    }
  }
}
</style>
