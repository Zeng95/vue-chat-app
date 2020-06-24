<template>
  <div class="message-form-emoji-picker" v-click-outside="hide">
    <picker
      :autoFocus="autoFocus"
      title="Pick your emoji..."
      emoji="point_up"
      @select="selectEmoji"
    />
  </div>
</template>

<script>
import { Picker } from 'emoji-mart-vue'
import ClickOutside from 'vue-click-outside'

export default {
  name: 'MessageFormEmojiPicker',
  directives: { ClickOutside },
  components: { Picker },
  props: {
    autoFocus: {
      type: Boolean
    }
  },
  methods: {
    selectEmoji(emoji) {
      this.$emit('input', emoji)
      this.hide()
    },
    hide() {
      this.$emit('hide')
    }
  }
}
</script>

<style lang="scss" scoped>
.message-form-emoji-picker {
  position: fixed;
  right: 15px;
  bottom: 71px;

  .emoji-mart {
    border: 0;
    box-shadow: 0 0 0 1px rgba(29, 28, 29, 0.13),
      0 4px 12px 0 rgba(0, 0, 0, 0.08);
  }

  ::v-deep.emoji-mart-search {
    padding: 14px;

    input {
      width: 100%;
      height: 32px;
      border-radius: 4px;

      &:focus {
        box-shadow: rgb(18, 100, 163) 0px 0px 0px 1px,
          rgba(29, 155, 209, 0.3) 0px 0px 0px 5px;
      }
    }
  }
}
</style>
