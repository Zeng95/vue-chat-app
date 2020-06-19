<template>
  <b-modal
    centered
    v-model="modalShow"
    title="Create a channel"
    title-tag="h1"
    header-border-variant="transparent"
    ok-only
    ok-title="Create"
    :ok-variant="btnDisabled ? 'secondary' : 'primary'"
    :ok-disabled="btnDisabled"
    @ok="addChannel"
    @hidden="hideModal"
    content-class="channel-create-modal"
    header-class="align-items-center"
  >
    <p class="text-secondary">
      Channels are where you communicate with groups. They’re best when
      organized around a topic — #marketing, for example.
    </p>

    <b-form class="form" autocomplete="off">
      <!-- Name -->
      <b-form-group label-for="input-name">
        <template v-slot:label>
          <strong>Name</strong>
        </template>

        <span class="icon-hash position-absolute">
          <b-icon-hash variant="secondary" />
        </span>

        <b-form-input
          id="input-name"
          class="input border-secondary"
          trim
          autofocus
          size="lg"
          max="80"
          v-model="newChannel.name"
          placeholder="e.g. plan-budget"
          @focus="charactersShow = true"
          @blur="charactersShow = false"
          @input.native="newChannel.name = $event.target.value.toLowerCase()"
          @keyup.enter="addChannel"
        ></b-form-input>

        <transition name="fade">
          <div
            v-if="charactersShow"
            class="input-count-characters-remaining text-secondary"
          >
            {{ characters }}
          </div>
        </transition>
      </b-form-group>

      <!-- Description -->
      <b-form-group
        label-for="input-description"
        description="What’s this channel about?"
      >
        <template v-slot:label>
          <strong>Description</strong>&nbsp;(optional)
        </template>

        <b-form-input
          id="input-description"
          class="border-secondary"
          size="lg"
          v-model="newChannel.description"
          @keyup.enter="addChannel"
        ></b-form-input>
      </b-form-group>
    </b-form>
  </b-modal>
</template>

<script>
import { mapActions } from 'vuex'
import { BIconHash } from 'bootstrap-vue'
export default {
  name: 'ChannelListModalCreate',
  components: { BIconHash },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    btnDisabled() {
      const { name, description } = this.newChannel

      return name.length === 0 && description.length === 0
    },
    characters() {
      return this.totalCharacters - this.newChannel.name.length
    }
  },
  data() {
    return {
      newChannel: { name: '', description: '' },
      totalCharacters: 80,
      charactersShow: false,
      modalShow: this.visible
    }
  },
  watch: {
    visible(value) {
      this.modalShow = value
    }
  },
  methods: {
    ...mapActions('channels', ['createChannel']),
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
        this.hideModal()
        this.newChannel = ''
      }
    },
    hideModal() {
      this.newChannel.name = ''
      this.newChannel.description = ''

      this.$emit('hideModal')
    }
  }
}
</script>
