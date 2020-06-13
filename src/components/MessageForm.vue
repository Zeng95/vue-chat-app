<template>
  <div class="message-form">
    <div
      class="editor position-relative"
      :class="{ focus: messageFormFocused }"
      @click="onFocus"
      v-click-outside="onBlur"
    >
      <div class="message-input">
        <editor-content class="editor-content text-left" :editor="editor" />
      </div>

      <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
        <div class="message-menubar position-relative">
          <div class="toolbar h-100">
            <b-button
              v-b-tooltip.hover
              title="Bold"
              variant="transparent"
              class="btn-unstyled"
              :class="{ 'is-active': isActive.bold() }"
              @click="commands.bold"
            >
              <b-icon-type-bold />
            </b-button>
            <b-button
              v-b-tooltip.hover
              title="Italic"
              variant="transparent"
              class="btn-unstyled"
              :class="{ 'is-active': isActive.italic() }"
              @click="commands.italic"
            >
              <b-icon-type-italic />
            </b-button>
            <b-button
              v-b-tooltip.hover
              title="Strikethrough"
              variant="transparent"
              class="btn-unstyled"
              :class="{ 'is-active': isActive.strike() }"
              @click="commands.strike"
            >
              <b-icon-type-strikethrough />
            </b-button>
            <b-button
              v-b-tooltip.hover
              title="Code"
              variant="transparent"
              class="btn-unstyled"
              :class="{ 'is-active': isActive.code() }"
              @click="commands.code"
            >
              <b-icon-code-slash />
            </b-button>
            <b-button
              v-b-tooltip.hover
              title="Link"
              variant="transparent"
              class="btn-unstyled"
              :class="{ 'is-active': isActive.link() }"
              @click="commands.link"
            >
              <b-icon-link45deg />
            </b-button>
            <b-button
              v-b-tooltip.hover
              title="Ordered list"
              variant="transparent"
              class="btn-unstyled"
              :class="{ 'is-active': isActive.bullet_list() }"
              @click="commands.bullet_list"
            >
              <b-icon-list-ol />
            </b-button>
            <b-button
              v-b-tooltip.hover
              title="Bulleted list"
              variant="transparent"
              class="btn-unstyled"
              :class="{ 'is-active': isActive.ordered_list() }"
              @click="commands.ordered_list"
            >
              <b-icon-list-ul />
            </b-button>
            <b-button
              v-b-tooltip.hover
              title="Blockquote"
              variant="transparent"
              class="btn-unstyled menubar__button"
              :class="{ 'is-active': isActive.blockquote() }"
              @click="commands.blockquote"
            >
              <b-icon-blockquote-left />
            </b-button>
            <b-button
              v-b-tooltip.hover
              title="Code block"
              variant="transparent"
              class="btn-unstyled"
              :class="{ 'is-active': isActive.code_block() }"
              @click="commands.code_block"
            >
              <b-icon-code />
            </b-button>
          </div>

          <div class="buttons position-absolute">
            <!-- Send message -->
            <b-button
              v-b-tooltip.hover
              title="Send message"
              variant="transparent"
              class="btn-unstyled btn-send"
              :disabled="message === null"
              @click="sendMessage"
            >
              <b-icon-cursor-fill rotate="45" />
            </b-button>

            <!-- Upload file -->
            <b-button
              v-b-tooltip.hover
              title="Attach file"
              variant="transparent"
              class="btn-unstyled btn-file"
            >
              <b-icon-paperclip flip-h />
            </b-button>

            <!-- Emoji -->
            <b-button
              v-b-tooltip.hover
              title="Emoji"
              variant="transparent"
              class="btn-unstyled btn-emoji"
              @click.stop="toggleEmojiPicker"
            >
              <b-icon-emoji-smile class="icon-emoji-smile" />

              <b-iconstack class="icon-emoji-laughing">
                <b-icon-circle-fill stacked variant="warning" />
                <b-icon-emoji-laughing stacked />
              </b-iconstack>
            </b-button>

            <!-- Mention -->
            <b-button
              v-b-tooltip.hover
              title="Mention someone"
              variant="transparent"
              class="btn-unstyled btn-mention"
            >
              <b-icon-at />
            </b-button>

            <!-- Hide formatting -->
            <b-button
              v-b-tooltip.hover
              title="Hide formatting"
              variant="transparent"
              class="btn-unstyled btn-text"
            >
              <b-icon-type />
            </b-button>
          </div>
        </div>
      </editor-menu-bar>
    </div>

    <div class="notification-bar"></div>

    <message-emoji-picker
      v-if="emojiPickerShow"
      :autoFocus="emojiPickerFocused"
    />

    <message-modal-upload />

    <app-alert
      :visible="alertShow"
      :message="alertMessage"
      :variant="alertVariant"
      @hideAlert="alertShow = !alertShow"
    />
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import {
  BIconAt,
  BIconType,
  BIconCode,
  BIconstack,
  BIconListOl,
  BIconListUl,
  BIconTypeBold,
  BIconPaperclip,
  BIconLink45deg,
  BIconCodeSlash,
  BIconTypeItalic,
  BIconCursorFill,
  BIconEmojiSmile,
  BIconCircleFill,
  BIconEmojiLaughing,
  BIconBlockquoteLeft,
  BIconTypeStrikethrough
} from 'bootstrap-vue'
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Bold,
  Code,
  Link,
  Strike,
  Italic,
  ListItem,
  Underline,
  CodeBlock,
  BulletList,
  Blockquote,
  OrderedList,
  Placeholder
} from 'tiptap-extensions'
import ClickOutside from 'vue-click-outside'
import AppAlert from '@/components/AppAlert'
import MessageModalUpload from './MessageModalUpload'
import MessageEmojiPicker from './MessageEmojiPicker'

export default {
  name: 'MessageForm',
  components: {
    AppAlert,
    BIconAt,
    BIconCode,
    BIconType,
    BIconstack,
    BIconListOl,
    BIconListUl,
    EditorMenuBar,
    EditorContent,
    BIconTypeBold,
    BIconPaperclip,
    BIconLink45deg,
    BIconCodeSlash,
    BIconTypeItalic,
    BIconCursorFill,
    BIconEmojiSmile,
    BIconCircleFill,
    BIconEmojiLaughing,
    BIconBlockquoteLeft,
    BIconTypeStrikethrough,
    MessageModalUpload,
    MessageEmojiPicker
  },
  computed: {
    ...mapState({ isPrivate: state => state.channels.isPrivate }),
    ...mapGetters('channels', ['currentChannel'])
  },
  data() {
    return {
      message: null,
      messageFormFocused: true,

      emojiPickerShow: false,
      emojiPickerFocused: false,

      alertShow: false,
      alertMessage: '',
      alertVariant: '',

      editor: new Editor({
        autoFocus: true,
        extensions: [
          new Blockquote(),
          new CodeBlock(),
          new BulletList(),
          new OrderedList(),
          new ListItem(),
          new Bold(),
          new Code(),
          new Italic(),
          new Link(),
          new Strike(),
          new Underline(),
          new Placeholder({
            emptyEditorClass: 'is-editor-empty',
            emptyNodeClass: 'is-empty',
            emptyNodeText: 'Message #react.js',
            showOnlyWhenEditable: true,
            showOnlyCurrent: true
          })
        ],
        onFocus: () => {
          if (this.emojiPickerShow) {
            this.emojiPickerShow = false
          }
        },
        onUpdate: ({ getHTML }) => {
          let div = document.createElement('div')
          div.innerHTML = getHTML()

          if (div.innerText.trim().length === 0) {
            this.message = null
          } else {
            this.message = getHTML()
          }
        }
      })
    }
  },
  methods: {
    ...mapActions('messages', ['createMessage', 'createPrivateMessage']),
    toggleEmojiPicker() {
      this.emojiPickerShow = !this.emojiPickerShow
      this.emojiPickerFocused = !this.emojiPickerFocused

      this.messageFormFocused = !this.messageFormFocused

      if (this.messageFormFocused) {
        this.editor.focus()
      }
    },
    onFocus() {
      this.messageFormFocused = true
    },
    onBlur() {
      this.messageFormFocused = false
    },
    async sendMessage() {
      try {
        if (this.isPrivate) {
          await this.createPrivateMessage({
            content: this.message,
            timestamp: window.firebase.firestore.Timestamp.now()
          })
        } else {
          await this.createMessage({
            content: this.message,
            timestamp: window.firebase.firestore.Timestamp.now()
          })
        }

        this.alertShow = true
        this.alertMessage = 'Send successfully'
        this.alertVariant = 'success'
      } catch (error) {
        this.alertShow = true
        this.alertMessage = error.message
        this.alertVariant = 'danger'
      } finally {
        // Clear message
        this.editor.clearContent()
      }
    }
  },
  directives: {
    ClickOutside
  },
  watch: {
    currentChannel(val) {
      const prefix = 'Message'

      if (!this.isPrivate) {
        this.editor.extensions.options.placeholder.emptyNodeText = `${prefix} #${val.name}`
      } else {
        this.editor.extensions.options.placeholder.emptyNodeText = `${prefix} ${val.name}`
      }
    }
  },
  beforeDestroy() {
    this.editor.destroy()
  }
}
</script>

<style lang="scss">
.message-form {
  padding: 0 20px;

  .btn-unstyled {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    width: 32px;
    height: 32px;
    border: 0;
    border-radius: 2px;
    color: rgba(29, 28, 29, 0.7);
    transition: all 0.2s;

    &:hover {
      background: rgba(29, 28, 29, 0.04);
      color: rgb(29, 28, 29);
    }

    &:active {
      background-color: rgba(29, 28, 29, 0.13);
    }

    &:focus {
      box-shadow: unset;
    }

    &.is-active {
      background-color: rgba(29, 28, 29, 0.13);
      color: rgb(29, 28, 29);

      &:hover {
        background-color: rgba(29, 28, 29, 0.2);
      }
    }
  }

  .editor {
    margin: 0 auto;
    width: 100%;
    border: 1px solid rgba(29, 28, 29, 0.7);
    border-radius: 4px;

    &.focus {
      &::after {
        position: absolute;
        bottom: 41px;
        left: 0;
        display: block;
        width: 100%;
        height: 1px;
        background-color: rgb(221, 221, 221);
        content: '';
      }

      .message-menubar {
        background-color: rgb(248, 248, 248);
      }

      .btn-unstyled {
        opacity: 1;
        pointer-events: all;
      }

      .buttons {
        .btn-text {
          background-color: rgba(29, 28, 29, 0.13);
          color: rgb(29, 28, 29);
          opacity: 1;
          pointer-events: all;
        }
      }
    }

    p.is-editor-empty:first-child::before {
      float: left;
      height: 0;
      color: #9c9c9c;
      content: attr(data-empty-text);
      pointer-events: none;
    }
  }

  .message-input {
    margin: 7px 0;
    padding: 4px 0 4px 10px;
  }

  .message-menubar {
    height: 40px;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
    background-color: transparent;
    transition: all 0.2s;
  }

  .toolbar {
    display: flex;
    align-items: center;
    padding-left: 4px;

    .btn-unstyled {
      opacity: 0.2;
      pointer-events: none;

      &:not(:last-child) {
        margin-right: 1px;
      }
    }
  }

  .buttons {
    top: 4px;
    right: 4px;

    .btn {
      position: absolute;
      top: 0;

      &.btn-send {
        right: 0;
        background: #007a5a;
        color: #fff;
        transition: opacity 0.2s, background-color 0.2s, color 0.2s;

        &:hover {
          background: #148567;
        }

        &:active {
          background: rgba(29, 28, 29, 0.13);
        }

        &:disabled {
          background: unset;
          color: rgba(29, 28, 29, 0.7);
          opacity: 0.2;
        }
      }

      &.btn-file {
        right: 33px;
      }

      &.btn-emoji {
        right: 66px;

        &:hover {
          .icon-emoji-smile {
            display: none;
          }

          .icon-emoji-laughing {
            display: block;
          }
        }

        .icon-emoji-laughing {
          display: none;
        }
      }

      &.btn-mention {
        right: 99px;
      }

      &.btn-text {
        right: 132px;
        color: rgba(29, 28, 29, 0.7);
        opacity: 0.2;
        pointer-events: none;
      }

      &.btn-mention,
      &.btn-text {
        .b-icon {
          font-size: 20px;
        }
      }

      .b-icon {
        font-size: 15px;
      }
    }
  }

  .notification-bar {
    height: 24px;
  }
}
</style>
