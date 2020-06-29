<template>
  <b-sidebar
    lazy
    right
    no-header
    :width="getWidth"
    bg-variant="white"
    sidebar-class="border-left"
    v-model="detailsShow"
  >
    <template v-slot:default>
      <header class="details-header px-3">
        <div>
          <div class="title">Details</div>
          <div class="subtitle">{{ currentChannel.name }}</div>
        </div>

        <b-button
          variant="transparent"
          class="btn-close btn-unstyled"
          v-b-tooltip.hover.bottomleft="'Close'"
          @click="hide"
        >
          <b-icon-x />
        </b-button>
      </header>

      <div class="details-body">
        <div class="profile text-center">
          <b-avatar
            rounded
            button
            class="profile-avatar"
            size="120px"
            :src="currentSender.avatar"
          />

          <div class="profile-name">
            <b-button variant="transparent" class="btn-unstyled text">
              <span>{{ currentChannel.name }}</span>
            </b-button>

            <div class="icon-hash-or-circle">
              <b-icon-circle
                font-scale="0.6"
                class="border border-dark rounded-circle"
              />
            </div>
          </div>
        </div>

        <div class="actions">
          <b-button
            variant="transparent"
            class="btn-action btn-unstyled d-flex flex-column align-items-center"
            v-b-tooltip.hover.bottom="`Find in @${currentSender.username}`"
          >
            <div class="icon-container"><b-icon-search font-scale="0.9" /></div>
            <span class="label">Find</span>
          </b-button>

          <b-button
            variant="transparent"
            class="btn-action btn-unstyled d-flex flex-column align-items-center"
            v-b-tooltip.hover.bottom="
              `More options for @${currentSender.username}`
            "
          >
            <div class="icon-container"><b-icon-three-dots /></div>
            <span class="label">More</span>
          </b-button>
        </div>

        <!-- The About section -->
        <div class="section-info section">
          <b-navbar class="m-2 p-3">
            <!-- Icon -->
            <b-navbar-toggle
              target="collapse-info"
              class="navbar-chevron btn-unstyled"
            >
              <div class="section-title">About</div>
              <b-icon-chevron-right font-scale="0.8" variant="dark" />
            </b-navbar-toggle>
          </b-navbar>

          <b-collapse id="collapse-info" is-nav accordion="member-details">
            <div class="field ml-2 pl-3">
              <div class="label">Display name</div>
              <div class="value">{{ currentSender.name }}</div>
            </div>

            <div class="field ml-2 pl-3">
              <div class="label">Local time</div>
              <div class="value">{{ localTime }}</div>
            </div>

            <div class="field ml-2 mb-2 pl-3 pb-3">
              <div class="label">Email address</div>
              <div class="value">
                <b-link :href="`mailto:${currentSender.email}`" target="_blank">
                  {{ currentSender.email }}
                </b-link>
              </div>
            </div>
          </b-collapse>
        </div>

        <!-- The Pinned section -->
        <div class="section-pinned-items section">
          <b-navbar toggleable class="m-2 p-3">
            <b-navbar-toggle
              target="collapse-pinned-items"
              class="navbar-chevron btn-unstyled"
            >
              <div class="section-title">Pinned</div>
              <b-icon-chevron-right font-scale="0.8" variant="dark" />
            </b-navbar-toggle>
          </b-navbar>

          <b-collapse
            id="collapse-pinned-items"
            is-nav
            accordion="member-details"
          >
            <div class="ml-2 mb-2 pl-3 pb-3">
              <p class="text-dark-grayish-magenta">
                No items have been pinned yet! Open the context menu on
                important messages or files and choose <br />
                <span class="text-dark-magenta">Pin to this conversation</span>
                to stick them here.
              </p>
            </div>
          </b-collapse>
        </div>

        <!-- The Files section -->
        <div class="section-shared-files section">
          <b-navbar toggleable class="m-2 p-3">
            <b-navbar-toggle
              target="collapse-shared-files"
              class="navbar-chevron btn-unstyled"
            >
              <div class="section-title">Files</div>
              <b-icon-chevron-right font-scale="0.8" variant="dark" />
            </b-navbar-toggle>
          </b-navbar>

          <b-collapse
            id="collapse-shared-files"
            is-nav
            class="px-3 pb-3 mx-2 mb-2"
            accordion="member-details"
          >
            <b-navbar-nav class="ml-auto">
              <b-nav-item href="#">Link 1</b-nav-item>
              <b-nav-item href="#">Link 2</b-nav-item>
              <b-nav-item href="#" disabled>Disabled</b-nav-item>
            </b-navbar-nav>
          </b-collapse>
        </div>
      </div>
    </template>
  </b-sidebar>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  BIconX,
  BIconSearch,
  BIconCircle,
  BIconThreeDots,
  BIconChevronRight
} from 'bootstrap-vue'
import moment from 'moment'

export default {
  name: 'MemberDetails',
  components: {
    BIconX,
    BIconSearch,
    BIconCircle,
    BIconThreeDots,
    BIconChevronRight
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...mapGetters('channels', ['currentChannel']),
    ...mapGetters('users', ['currentSender']),
    getWidth() {
      let width = null

      if (window.innerWidth > 1200) {
        width = '380px'
      } else {
        width = '320px'
      }

      return width
    }
  },
  data() {
    return {
      detailsShow: this.visible,

      localTime: null
    }
  },
  methods: {
    hide() {
      this.$emit('hide')
    },
    getLocalTime() {
      this.localTime = moment().format('LT')

      clearTimeout(this.timer)
      this.timer = setTimeout(this.getLocalTime, 1000)
    }
  },
  watch: {
    visible(value) {
      this.detailsShow = value
    }
  },
  created() {
    this.getLocalTime()
  }
}
</script>

<style lang="scss" scoped>
::v-deep.b-sidebar-outer {
  .b-sidebar {
    top: 50px;
    border-color: rgba(29, 28, 29, 0.13);
  }
}

.details-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  border-bottom: 1px solid rgba(29, 28, 29, 0.13);

  .title {
    color: var(--dark-magenta);
    font-weight: 900;
  }

  .subtitle {
    font-size: 13px;
  }

  .btn-close {
    width: 36px;
    height: 36px;

    &:active {
      color: #1264a3;
    }

    &:hover {
      background: rgba(29, 28, 29, 0.04);
      color: var(--dark-magenta);
    }

    &.btn-unstyled:active {
      background: rgba(29, 28, 29, 0.13);
    }
  }
}

.details-body {
  .profile-avatar {
    margin: 28px auto 0;
  }

  .profile-name {
    display: flex;
    align-items: baseline;
    justify-content: center;
    margin: 16px 16px 0;
    margin-bottom: 2px;

    .text {
      font-weight: 900;
      font-size: 18px;

      &:hover {
        text-decoration: underline;
      }
    }

    .icon-hash-or-circle {
      display: flex;
      justify-content: center;
      width: 20px;
    }
  }

  .actions {
    display: flex;
    justify-content: center;
    padding-top: 18px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(29, 28, 29, 0.13);

    .btn-action {
      width: 80px;
      text-align: center;
    }

    .icon-container {
      margin-bottom: 4px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: rgba(29, 28, 29, 0.04);
      color: rgb(29, 28, 29);
      text-align: center;
      line-height: 40px;

      &:hover {
        background-color: rgba(29, 28, 29, 0.1);
      }

      &:active {
        background-color: rgba(29, 28, 29, 0.15);
      }
    }

    .label {
      color: rgba(29, 28, 29, 0.7);
      font-size: 13px;
    }
  }

  .section {
    border-bottom: 1px solid rgba(29, 28, 29, 0.13);

    .navbar-chevron {
      display: flex;
      align-items: center;
      width: 100%;

      &.not-collapsed {
        .b-icon {
          transform: rotate(90deg);
        }
      }

      .b-icon {
        transition: transform 0.2s ease-in-out;
      }

      .section-title {
        flex-grow: 1;
        margin: 0;
        margin-right: 8px;
        padding: 0;
        color: var(--dark-magenta);
        text-align: left;
        font-weight: 700;
        font-size: 15px;
        line-height: 1.38463;
      }
    }
  }

  .section-info {
    .field {
      padding: 0 16px 12px 0;
    }

    .label {
      color: rgba(29, 28, 29, 0.7);
      font-weight: 400;
      font-weight: 700;
      font-size: 13px;
      line-height: 1.38463;
    }
  }
}
</style>
