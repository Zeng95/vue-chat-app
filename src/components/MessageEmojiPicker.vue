<template>
  <div class="message-emoji-picker">
    <picker
      :autoFocus="autoFocus"
      title="Pick your emoji..."
      emoji="point_up"
    />
  </div>
</template>

<script>
import { Picker } from 'emoji-mart-vue'

export default {
  name: 'MessageEmojiPicker',
  props: {
    autoFocus: {
      type: Boolean
    }
  },
  components: { Picker }
}
</script>

<style lang="scss" scoped>
.message-emoji-picker {
  position: absolute;
  right: 15px;
  bottom: 67px;

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
