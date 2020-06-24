<template>
  <div v-if="asyncDataStatus_ready" class="chat">
    <chat-nav-bar />

    <div
      class="layout"
      :class="{ expanded: memberDetailsShow || channelDetailsShow }"
    >
      <div class="sidebar">
        <channel-list />

        <member-list />
      </div>

      <div class="view">
        <b-card no-body class="view-contents border-0 h-100">
          <!-- Card header -->
          <b-card-header
            class="view-header"
            header-tag="header"
            header-bg-variant="white"
          >
            <div class="channel-info">
              <div class="name-and-section">
                <b-button
                  variant="transparent"
                  class="name btn-unstyled"
                  @click="toggleDetails"
                >
                  <div class="icon-hash-or-circle">
                    <b-icon-hash v-if="!isPrivate" />
                    <b-icon-circle
                      v-else
                      font-scale="0.6"
                      class="border border-dark rounded-circle"
                    />
                  </div>

                  <span class="text-dark">{{ currentChannel.name }}</span>
                </b-button>

                <b-button
                  variant="transparent"
                  class="section-selector btn-unstyled"
                  v-b-tooltip.hover.bottom="
                    `Star ${isPrivate ? 'conversation' : 'channel'}`
                  "
                >
                  <b-icon-star font-scale="0.8" />
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
              class="btn-open-details btn-unstyled"
              :class="{ opened: memberDetailsShow || channelDetailsShow }"
              v-b-tooltip.hover.bottom="
                `Show ${isPrivate ? 'conversation' : 'channel'} details`
              "
              @click="toggleDetails"
            >
              <span class="icon-circle">
                <b-icon-exclamation-circle flip-v />
              </span>

              <span class="btn-text">Details</span>
            </b-button>
          </b-card-header>

          <b-card-body body-class="position-relative p-0 overflow-auto">
            <!-- Jumbotron -->
            <b-jumbotron
              fluid
              container-fluid
              header-tag="div"
              header-level="5"
              :lead="`This is a private conversation between you and ${currentChannel.name}.`"
              bg-variant="light"
              class="banner"
              v-if="isPrivate && bannerShow"
            >
              <template v-slot:header>
                <div class="d-inline-flex">
                  <span class="icon-presense text-dark-grayish-magenta">
                    <b-icon-hash v-if="!isPrivate" />
                    <b-icon-circle v-else />
                  </span>
                  <h1 class="heading">{{ currentChannel.name }}</h1>
                </div>

                <b-button
                  class="banner-close btn-unstyled text-dark-grayish-magenta"
                  variant="transparent"
                  @click="bannerShow = !bannerShow"
                >
                  <b-icon-x />
                </b-button>
              </template>

              <p class="text">Next, you could…</p>

              <b-button variant="primary" href="#">More Info</b-button>
            </b-jumbotron>

            <!-- File upload progress bar -->
            <div class="file-upload-banner">
              <b-progress
                v-if="progressBarShow"
                class="position-absolute"
                variant="success"
                :max="progress.max"
                :animated="progressBarAnimated"
                :value="progress.value"
              >
              </b-progress>

              <div class="file-upload-banner-text">
                <p v-if="!progressBarCompleted">
                  Uploading {{ fileName }} {{ progress.value }}%
                </p>

                <p v-else>Processing uploaded file…</p>
              </div>
            </div>

            <message-list />
          </b-card-body>

          <b-card-footer
            class="footer"
            footer-tag="footer"
            footer-class="p-0 border-0"
            footer-bg-variant="transparent"
          >
            <message-form
              :focused="messageFormFocused"
              @upload-completed="progressBarCompleted = true"
              @get-progress="getTaskProgress"
              @show-progress-bar="showProgressBar"
              @hide-progress-bar="hideProgressBar"
            />
          </b-card-footer>
        </b-card>
      </div>

      <div class="details">
        <member-details
          :visible="memberDetailsShow"
          @hide="memberDetailsShow = !memberDetailsShow"
        />
      </div>
    </div>
  </div>
</template>

<script>
import asyncDataStatus from '@/mixins/asyncDataStatus'
import {
  BIconX,
  BIconHash,
  BIconStar,
  BIconPerson,
  BIconCircle,
  BIconExclamationCircle
} from 'bootstrap-vue'
import { mapState, mapGetters } from 'vuex'
import ChatNavBar from '@/components/ChatNavBar'
import ChannelList from '@/components/ChannelList'
import MessageList from '@/components/MessageList'
import MessageForm from '@/components/MessageForm'
import MemberList from '@/components/MemberList'
import MemberDetails from '@/components/MemberDetails'

export default {
  name: 'Chat',
  mixins: [asyncDataStatus],
  components: {
    BIconX,
    BIconHash,
    BIconStar,
    BIconPerson,
    BIconCircle,
    BIconExclamationCircle,
    ChatNavBar,
    MemberList,
    ChannelList,
    MessageList,
    MessageForm,
    MemberDetails
  },
  computed: {
    ...mapState({ isPrivate: state => state.channels.isPrivate }),
    ...mapGetters('channels', ['currentChannel'])
  },
  data() {
    return {
      bannerShow: true,
      fileName: null,

      progress: { value: 0, max: 100 },
      progressBarShow: false,
      progressBarAnimated: false,
      progressBarCompleted: false,

      memberDetailsShow: false,
      channelDetailsShow: false,

      messageFormFocused: true
    }
  },
  methods: {
    getTaskProgress({ progress, fileName }) {
      if (progress === 0) {
        this.fileName = fileName
        this.progress.value = progress
        this.progressBarAnimated = true

        this.timer = setInterval(() => {
          this.progress.value++
        }, 200)
      }

      if (progress === 100) {
        clearInterval(this.timer)

        this.progress.value = progress
      }
    },

    showProgressBar() {
      this.progressBarShow = true
    },
    hideProgressBar() {
      this.progressBarShow = false
      this.progressBarAnimated = false
      this.progressBarCompleted = false
    },

    toggleDetails() {
      this.messageFormFocused = !this.messageFormFocused

      if (this.isPrivate) {
        this.memberDetailsShow = !this.memberDetailsShow
      } else {
        this.channelDetailsShow = !this.channelDetailsShow
      }
    }
  },
  async beforeCreate() {
    await this.$store.dispatch('channels/fetchChannels')
    await this.$store.dispatch('messages/fetchMessages')
    await this.$store.dispatch('users/fetchUsers')

    this.asyncDataStatus_fetched()
  }
}
</script>

<style lang="scss" scoped>
.chat {
  width: 100vw;
  height: 100vh;

  .layout {
    display: grid;

    grid-template-rows: auto;
    grid-template-columns: 260px auto;

    &.expanded {
      grid-template-columns: 260px auto 320px;
    }

    @media (min-width: 1200px) {
      &.expanded {
        grid-template-columns: 260px auto 380px;
      }
    }
  }

  .sidebar {
    background: var(--blue);
  }

  .view {
    height: calc(100vh - 50px);

    .btn-unstyled {
      padding: 0;
      border: 0;
    }

    .view-header {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      justify-content: space-between;
      height: 64px;

      .name-and-section {
        display: flex;
      }

      .name {
        display: flex;
        align-items: baseline;
        font-weight: 900;
      }

      .icon-hash-or-circle {
        display: flex;
        justify-content: center;
        width: 20px;
      }

      .section-selector {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 4px;
        width: 20px;
        height: 24px;
        color: rgba(29, 28, 29, 0.7);
        transition: background-color 0.16s cubic-bezier(0.36, 0.19, 0.29, 1),
          color 0.16s cubic-bezier(0.36, 0.19, 0.29, 1);

        &:hover {
          background-color: rgba(29, 28, 29, 0.04);
        }
      }

      .metadata {
        display: flex;
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

      .btn-open-details {
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

        &:active {
          background-color: rgba(29, 28, 29, 0.13);
        }

        &.opened {
          background-color: rgba(29, 28, 29, 0.13);
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
      position: relative;
      padding: 40px 56px 32px;
      border-bottom: 1px solid rgba(29, 28, 29, 0.13);

      .icon-presense {
        position: relative;
        margin-right: 8px;
        margin-bottom: 28px;
        width: 20px;

        .b-icon {
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

      .banner-close {
        position: absolute;
        top: 12px;
        right: 12px;
        width: 36px;
        height: 36px;

        &:hover {
          background-color: rgba(29, 28, 29, 0.04);
          color: var(--dark-magenta) !important;
        }

        &:active {
          background-color: rgba(29, 28, 29, 0.13);
        }

        &:focus {
          box-shadow: unset;
        }

        .b-icon {
          width: 20px;
          height: 20px;
        }
      }

      .lead {
        margin-bottom: 2rem;
        font-weight: normal;
        font-size: 15px;
      }

      .text {
        margin-bottom: 12px;
        color: #616061;
        font-size: 13px;
      }
    }

    .file-upload-banner {
      position: relative;
      top: 7px;
      left: 50%;
      width: 300px;
      height: 28px;
      transform: translate3d(-50%, 0, 0);
    }

    .progress {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 14px;
      background: #b2d5c9;
    }

    .file-upload-banner-text {
      position: absolute;
      top: 0;
      left: 0;
      overflow: hidden;
      padding: 0 16px;
      width: 100%;
      height: 100%;
      color: white;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 700;
      font-size: 13px;
      line-height: 28px;
    }
  }
}
</style>
