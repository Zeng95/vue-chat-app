<template>
  <div v-if="asyncDataStatus_ready" class="d-flex flex-column vh-100 vw-100">
    <ChatNavBar />

    <div class="grid flex-grow-1">
      <div class="sidebar">
        <ChannelList />

        <MemberList />
      </div>

      <div class="content">
        <b-card no-body class="flex-grow-1 border-0">
          <!-- Card header -->
          <b-card-header
            class="header"
            header-tag="header"
            header-bg-variant="white"
          >
            <div class="channel-info">
              <div class="name-and-section">
                <b-button variant="transparent" class="name btn-unstyled">
                  <span class="icon-hash-or-circle">
                    <b-icon-hash v-if="!isPrivate" />
                    <b-icon-circle-fill v-else />
                  </span>

                  <span class="name-dim">{{ currentChannel.name }}</span>
                </b-button>

                <b-button
                  variant="transparent"
                  class="section-selector btn-unstyled"
                  v-b-tooltip.hover.bottom
                  title="Star channel"
                >
                  <b-icon-star />
                </b-button>
              </div>

              <div class="metadata" v-if="!isPrivate">
                <b-button
                  variant="transparent"
                  class="info-members btn-unstyled"
                  v-b-tooltip.hover.bottom
                  title="View member list"
                >
                  <b-icon-person />
                  &nbsp;1
                </b-button>

                <span class="info-sep">|</span>

                <b-button variant="transparent" class="info-topic btn-unstyled">
                  <span>Add a topic</span>
                </b-button>
              </div>
            </div>

            <!-- Details button -->
            <b-button
              variant="transparent"
              class="details btn-unstyled"
              v-b-tooltip.hover.bottom
              title="Show channel details"
            >
              <span class="icon-circle">
                <b-icon-exclamation-circle />
              </span>

              <span class="btn-text">Details</span>
            </b-button>
          </b-card-header>

          <b-jumbotron
            fluid
            container-fluid
            header-tag="div"
            header-level="5"
            :lead="`This is a private conversation between you and ${currentChannel.name}.`"
            bg-variant="light"
            class="banner"
            v-if="isPrivate"
          >
            <template v-slot:header>
              <div class="d-inline-flex">
                <span class="icon-presense">
                  <b-icon-hash v-if="!isPrivate" />
                  <b-icon-circle-fill v-else />
                </span>
                <h1 class="heading">{{ currentChannel.name }}</h1>
              </div>
            </template>

            <p class="text">Next, you could…</p>

            <b-button variant="primary" href="#">More Info</b-button>
          </b-jumbotron>

          <div class="d-flex flex-column flex-grow-1">
            <b-card-body body-class="p-0">
              <MessageList />
            </b-card-body>

            <b-card-footer
              class="footer"
              footer-tag="footer"
              footer-class="p-0 border-0"
              footer-bg-variant="transparent"
            >
              <MessageForm />
            </b-card-footer>
          </div>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import ChatNavBar from '@/components/ChatNavBar'
import ChannelList from '@/components/ChannelList'
import MessageList from '@/components/MessageList'
import MessageForm from '@/components/MessageForm'
import MemberList from '@/components/MemberList'
import asyncDataStatus from '@/mixins/asyncDataStatus'
import {
  BIconHash,
  BIconStar,
  BIconPerson,
  BIconCircleFill,
  BIconExclamationCircle
} from 'bootstrap-vue'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Chat',
  mixins: [asyncDataStatus],
  components: {
    ChatNavBar,
    ChannelList,
    MessageList,
    MessageForm,
    MemberList,
    BIconHash,
    BIconStar,
    BIconPerson,
    BIconCircleFill,
    BIconExclamationCircle
  },
  computed: {
    ...mapState({ isPrivate: state => state.channels.isPrivate }),
    ...mapGetters('channels', ['currentChannel'])
  },
  async beforeCreate() {
    await this.$store.dispatch('channels/fetchChannels')
    await this.$store.dispatch('messages/fetchMessages')
    await this.$store.dispatch('users/fetchUsers')

    this.asyncDataStatus_fetched()
  }
}
</script>

<style lang="scss">
.grid {
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 260px auto;
}

.sidebar {
  .menu {
    min-width: 200px;
    max-width: 360px;
    border-radius: 6px;
    background-color: rgb(248, 248, 248);
    box-shadow: 0 0 0 1px rgba(29, 28, 29, 0.13),
      0 4px 12px 0 rgba(0, 0, 0, 0.12);

    .arrow {
      visibility: hidden;
    }

    .popover-body {
      padding: 12px 0;
    }

    .btn-menu-item {
      min-height: 28px;
      text-align: left;
    }
  }
}

.content {
  display: flex;
  flex-direction: column;

  .btn-unstyled {
    padding: 0;
    border: 0;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;

    .name-and-section {
      display: flex;
      align-items: center;
    }

    .metadata {
      display: flex;
    }

    .name {
      display: flex;
      align-items: center;
      font-weight: 900;
    }

    .name-dim {
      color: rgba(29, 28, 29, 0.7);
    }

    .icon-hash-or-circle {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 20px;
      height: 20px;

      > .b-icon {
        width: 10px;
        height: 10px;
      }
    }

    .section-selector {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 4px;
      width: 20px;
      height: 20px;
      border: thin solid transparent;
      color: rgba(29, 28, 29, 0.7);
      transition: background-color 0.16s cubic-bezier(0.36, 0.19, 0.29, 1),
        color 0.16s cubic-bezier(0.36, 0.19, 0.29, 1);

      &:hover {
        background-color: rgba(29, 28, 29, 0.04);
      }

      > .b-icon {
        width: 13px;
        height: 13px;
      }
    }

    .info-members {
      > .b-icon {
        width: 13px;
      }
    }

    .info-sep {
      margin: 0 6px;
      color: rgba(29, 28, 29, 0.5);
      opacity: 0.5;
    }

    .info-topic {
      color: rgba(29, 28, 29, 0.7);
    }

    .details {
      display: flex;
      align-items: center;
      padding: 8px;
      color: rgba(29, 28, 29, 0.7);
      font-weight: 700;
      transition: all 0.2s;

      &:hover {
        background-color: rgba(29, 28, 29, 0.04);
        color: rgb(29, 28, 29);
      }

      .icon-circle {
        width: 20px;
        height: 20px;
      }

      .btn-text {
        margin-left: 8px;
      }
    }
  }

  .banner {
    padding: 40px 56px 32px;
    border-bottom: 1px solid rgba(29, 28, 29, 0.13);

    .icon-presense {
      position: relative;
      margin-right: 8px;
      margin-bottom: 28px;
      width: 20px;
      color: rgb(97, 96, 97);

      > .b-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 1rem;
        height: 1rem;
        transform: translate3d(-50%, -50%, 0);
      }
    }

    .heading {
      margin-bottom: 28px;
      letter-spacing: -0.25px;
      font-weight: 900;
      font-size: 40px;
    }

    .lead {
      font-size: 15px;
      margin-bottom: 2rem;
      font-weight: normal;
    }

    .text {
      margin-bottom: 12px;
      color: #616061;
      font-size: 13px;
    }
  }
}
</style>
