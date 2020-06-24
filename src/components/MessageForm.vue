<template>
  <div class="message-form">
    <div
      class="message-input position-relative"
      :class="{
        focus: messageFormFocused,
        expanded: editorTooBarShow && messageFormFocused
      }"
    >
      <div class="editor">
        <editor-content class="editor-content text-left" :editor="editor" />
      </div>

      <div class="files">
        <div class="multi-file-upload-gallery" v-if="files !== null">
          <div class="multi-file-upload-container">
            <div class="draft-image-file">
              <b-img
                rounded
                :src="previewImages"
                v-bind="{
                  blank: previewImagesBlank,
                  width: '100%',
                  height: '100%'
                }"
                blank-color="rgb(248, 248, 248)"
                class="draft-image-file-thumbnail w-100 h-100"
                alt="Thumbnail Image"
              />
              <b-spinner
                small
                v-if="previewImagesBlank"
                variant="primary"
                label="Spinning"
                style="border-width: 0.1rem;"
                class="position-absolute"
              ></b-spinner>
            </div>

            <b-button
              variant="transparent"
              class="btn-unstyled multi-file-upload-btn-status multi-file-upload-btn-status-remove"
              v-b-tooltip.hover
              title="Remove file"
              @click="removeFile"
            >
              <b-icon-x-circle-fill class="icon-remove" />
              <!-- <b-spinner
                small
                variant="primary"
                label="Spinning"
                style="border-width: 0.1rem;"
              ></b-spinner> -->
            </b-button>
          </div>
        </div>
      </div>

      <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
        <div class="menubar">
          <transition name="slide">
            <div class="toolbar" v-if="editorTooBarShow">
              <b-button
                v-b-tooltip.hover
                title="Bold"
                variant="transparent"
                class="btn-icon btn-unstyled"
                :class="{ 'is-active': isActive.bold() }"
                @click="commands.bold"
              >
                <b-icon-type-bold />
              </b-button>
              <b-button
                v-b-tooltip.hover
                title="Italic"
                variant="transparent"
                class="btn-icon btn-unstyled"
                :class="{ 'is-active': isActive.italic() }"
                @click="commands.italic"
              >
                <b-icon-type-italic />
              </b-button>
              <b-button
                v-b-tooltip.hover
                title="Strikethrough"
                variant="transparent"
                class="btn-icon btn-unstyled"
                :class="{ 'is-active': isActive.strike() }"
                @click="commands.strike"
              >
                <b-icon-type-strikethrough />
              </b-button>
              <b-button
                v-b-tooltip.hover
                title="Code"
                variant="transparent"
                class="btn-icon btn-unstyled"
                :class="{ 'is-active': isActive.code() }"
                @click="commands.code"
              >
                <b-icon-code-slash />
              </b-button>
              <b-button
                v-b-tooltip.hover
                title="Link"
                variant="transparent"
                class="btn-icon btn-unstyled"
                :class="{ 'is-active': isActive.link() }"
                @click="commands.link"
              >
                <b-icon-link45deg />
              </b-button>
              <b-button
                v-b-tooltip.hover
                title="Ordered list"
                variant="transparent"
                class="btn-icon btn-unstyled"
                :class="{ 'is-active': isActive.bullet_list() }"
                @click="commands.bullet_list"
              >
                <b-icon-list-ol />
              </b-button>
              <b-button
                v-b-tooltip.hover
                title="Bulleted list"
                variant="transparent"
                class="btn-icon btn-unstyled"
                :class="{ 'is-active': isActive.ordered_list() }"
                @click="commands.ordered_list"
              >
                <b-icon-list-ul />
              </b-button>
              <b-button
                v-b-tooltip.hover
                title="Blockquote"
                variant="transparent"
                class="btn-icon btn-unstyled"
                :class="{ 'is-active': isActive.blockquote() }"
                @click="commands.blockquote"
              >
                <b-icon-blockquote-left />
              </b-button>
              <b-button
                v-b-tooltip.hover
                title="Code block"
                variant="transparent"
                class="btn-icon btn-unstyled"
                :class="{ 'is-active': isActive.code_block() }"
                @click="commands.code_block"
              >
                <b-icon-code />
              </b-button>
            </div>
          </transition>

          <div class="buttons">
            <!-- Send message -->
            <b-button
              v-b-tooltip.hover="'Send message'"
              variant="transparent"
              class="btn-icon btn-send btn-unstyled"
              :disabled="message === null"
              @click="sendMessage"
            >
              <b-icon-cursor-fill rotate="45" />
            </b-button>

            <!-- Upload file -->
            <div id="file-upload">
              <b-button
                id="popover-target-btn-upload"
                v-b-tooltip.hover="'Attach file'"
                variant="transparent"
                class="btn-icon btn-file btn-unstyled"
                @click.stop="toggleFileUpload"
              >
                <b-icon-paperclip flip-h />
              </b-button>

              <b-popover
                target="popover-target-btn-upload"
                triggers="focus"
                placement="topleft"
                custom-class="popover-upload menu mt-0 border-0"
                :show="fileUploadShow"
                @hide="hideFileUpload"
              >
                <p class="menu-item-header">Add a file from…</p>

                <b-button
                  block
                  variant="light-gray"
                  class="menu-item-btn border-0 d-flex align-items-center"
                  @click="selectFile"
                >
                  <div class="icon-computer"><b-icon-display /></div>
                  <span class="flex-fill">Your computer</span>
                </b-button>
              </b-popover>

              <b-form-file
                plain
                hidden
                ref="file"
                v-model="files"
                @input="uploadFile"
              ></b-form-file>
            </div>

            <!-- Emoji -->
            <div id="emoji">
              <b-button
                v-b-tooltip.hover="'Emoji'"
                variant="transparent"
                class="btn-icon btn-emoji btn-unstyled"
                @click.stop="toggleEmojiPicker"
              >
                <b-icon-emoji-smile class="icon-emoji-smile" />

                <b-iconstack class="icon-emoji-laughing">
                  <b-icon-circle-fill stacked variant="warning" />
                  <b-icon-emoji-laughing stacked />
                </b-iconstack>
              </b-button>

              <message-form-emoji-picker
                v-if="emojiPickerShow"
                :autoFocus="emojiPickerFocused"
                @hide="hideEmojiPicker"
                @input="addEmoji"
              />
            </div>

            <!-- Mention -->
            <b-button
              v-b-tooltip.hover="'Mention someone'"
              variant="transparent"
              class="btn-icon btn-mention btn-unstyled"
            >
              <b-icon-at />
            </b-button>

            <!-- Hide formatting -->
            <b-button
              v-b-tooltip.hover="
                editorTooBarShow ? 'Hide formatting' : 'Show formatting'
              "
              variant="transparent"
              class="btn-icon btn-text btn-unstyled"
              :class="{ active: editorTooBarShow }"
              @click="toggleToolBar"
            >
              <b-icon-type />
            </b-button>
          </div>
        </div>
      </editor-menu-bar>
    </div>

    <div class="notification-bar"></div>

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
  BIconDisplay,
  BIconTypeBold,
  BIconPaperclip,
  BIconLink45deg,
  BIconCodeSlash,
  BIconTypeItalic,
  BIconCursorFill,
  BIconEmojiSmile,
  BIconCircleFill,
  BIconXCircleFill,
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
import { v4 as uuidv4 } from 'uuid'
import { storage } from '@/firebase.config'
import ClickOutside from 'vue-click-outside'
import AppAlert from './AppAlert'
import MessageFormEmojiPicker from './MessageFormEmojiPicker'
import { DOMParser } from 'prosemirror-model'

export default {
  name: 'MessageForm',
  props: {
    focused: {
      type: Boolean,
      required: true
    }
  },
  components: {
    AppAlert,
    BIconAt,
    BIconCode,
    BIconType,
    BIconstack,
    BIconListOl,
    BIconListUl,
    BIconDisplay,
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
    BIconXCircleFill,
    BIconEmojiLaughing,
    BIconBlockquoteLeft,
    BIconTypeStrikethrough,
    MessageFormEmojiPicker
  },
  computed: {
    ...mapState({ isPrivate: state => state.channels.isPrivate }),
    ...mapGetters('channels', ['currentChannel'])
  },
  data() {
    return {
      files: null,
      message: null,
      messageFormFocused: this.focused,

      emojiPickerShow: false,
      emojiPickerFocused: false,
      emoji: null,

      // Create a root reference
      storageRef: storage.ref(),
      fileUploadShow: false,
      fileUploadTask: null,

      previewImages: null,
      previewImagesBlank: false,

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
        onFocus: ({ state, view }) => {
          if (this.emoji !== null) {
            const div = document.createElement('div')
            div.innerHTML = this.emoji.native

            const { selection } = state
            const slice = DOMParser.fromSchema(state.schema).parseSlice(div)
            const transaction = state.tr.insert(selection.anchor, slice.content)

            view.dispatch(transaction)
            this.emoji = null
          }
        },
        onUpdate: ({ getHTML }) => {
          const div = document.createElement('div')
          div.innerHTML = getHTML()

          if (div.innerText.trim().length === 0) {
            this.message = null
          } else {
            this.message = getHTML()
          }
        }
      }),
      editorTooBarShow: true
    }
  },
  methods: {
    ...mapActions('messages', ['createMessage', 'createPrivateMessage']),

    toggleToolBar() {
      this.editorTooBarShow = !this.editorTooBarShow
      this.editor.focus()
    },

    selectFile() {
      this.$refs.file.$el.click()
    },
    removeFile() {
      this.files = null
    },
    uploadFile() {
      this.readURL(this.files)

      if (this.files !== null) return false

      this.$emit('show-progress-bar')

      const filePath = `${this.getFilePath()}/${uuidv4()}.jpg`

      this.fileUploadTask = this.storageRef.child(filePath).put(this.files)

      // Listen on file upload state change
      this.fileUploadTask.on(
        'state_changed',
        snapshot => {
          console.log(1)
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100

          this.$emit('get-progress', { progress, fileName: this.files.name })
        },
        error => {
          console.log(2)
          // Handle unsuccessful uploads
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              console.log(1)
              break
            case 'storage/canceled':
              // User canceled the upload
              console.log(2)
              break
            case 'storage/invalid-argument':
              console.log(3)
              break
            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              console.log(4)
              break
          }
        },
        () => {
          this.$emit('upload-completed')
          // Upload completed successfully, now we can get the download URL
          this.fileUploadTask.snapshot.ref
            .getDownloadURL()
            .then(downloadURL => {
              console.log('File available at', downloadURL)
              this.$emit('hide-progress-bar')
            })
        }
      )
    },
    readURL(files) {
      const reader = new FileReader()

      this.previewImagesBlank = true

      reader.onload = e => {
        this.previewImages = e.target.result
        this.previewImagesBlank = false
      }
      reader.readAsDataURL(files) // convert to base64 string
    },
    getFilePath() {
      return this.isPrivate ? `private/${this.currentChannel.id}` : 'public'
    },

    // File upload
    toggleFileUpload() {
      if (!this.fileUploadShow) {
        this.showFileUpload()
      } else {
        this.hideFileUpload()
      }
    },
    showFileUpload() {
      this.fileUploadShow = true

      this.messageFormFocused = false
    },
    hideFileUpload() {
      this.fileUploadShow = false

      this.messageFormFocused = true
      this.editor.focus()
    },

    // Emoji picker
    toggleEmojiPicker() {
      if (!this.emojiPickerShow) {
        this.showEmojiPicker()
      } else {
        this.hideEmojiPicker()
      }
    },
    showEmojiPicker() {
      this.emojiPickerShow = true
      this.emojiPickerFocused = true

      this.messageFormFocused = false
    },
    hideEmojiPicker() {
      this.emojiPickerShow = false

      this.messageFormFocused = true
      this.editor.focus()
    },
    addEmoji(value) {
      this.emoji = value
    },

    focusMessageForm() {
      this.messageFormFocused = true
    },
    blurMessageForm() {
      this.messageFormFocused = false
    },
    async sendMessage() {
      try {
        if (this.isPrivate) {
          await this.createPrivateMessage({
            body: this.message,
            timestamp: window.firebase.firestore.Timestamp.now()
          })
        } else {
          await this.createMessage({
            body: this.message,
            timestamp: window.firebase.firestore.Timestamp.now()
          })
        }

        this.alertShow = true
        this.alertMessage = 'Send successfully.'
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
    focused(value) {
      this.messageFormFocused = value
    },
    currentChannel(value) {
      const prefix = 'Message'

      if (!this.isPrivate) {
        this.editor.extensions.options.placeholder.emptyNodeText = `${prefix} #${value.name}`
      } else {
        this.editor.extensions.options.placeholder.emptyNodeText = `${prefix} ${value.name}`
      }
    }
  },
  beforeDestroy() {
    this.editor.destroy()
  }
}
</script>

<style lang="scss" scoped>
.message-form {
  padding: 0 20px;

  .btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 2px;
    color: rgba(29, 28, 29, 0.7);
    transition: all 0.2s;
    pointer-events: none;

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

  .message-input {
    margin: 0 auto;
    width: 100%;
    border: 1px solid rgba(29, 28, 29, 0.7);
    border-radius: 4px;

    &:after {
      position: absolute;
      bottom: 40px;
      left: 0;
      display: block;
      width: 100%;
      height: 1px;
      background-color: rgb(221, 221, 221);
      content: '';
      opacity: 0;
      transition: 0.2s all;
    }

    &.focus {
      .toolbar {
        background-color: rgb(248, 248, 248);
      }

      .btn-icon {
        opacity: 1;
        pointer-events: all;
      }

      .buttons {
        .btn-text {
          color: var(--dark-grayish-magenta);
          opacity: 1;
        }
      }
    }

    &.expanded {
      &::after {
        opacity: 1;
        transition-delay: 0.2s;
      }

      .buttons {
        .btn-text.active {
          background-color: rgba(29, 28, 29, 0.13);
          color: var(--dark-magenta);

          &:hover {
            background-color: rgba(29, 28, 29, 0.2);
          }
        }
      }
    }
  }

  ::v-deep.editor {
    margin: 7px 0;
    padding: 4px 0 4px 10px;

    p.is-editor-empty {
      &:first-child::before {
        float: left;
        height: 0;
        color: #9c9c9c;
        content: attr(data-empty-text);
        pointer-events: none;
      }
    }
  }

  .files {
    .multi-file-upload-gallery {
      margin: 12px 0;
      padding: 0 12px;
    }

    .multi-file-upload-container {
      position: relative;
      display: inline-block;
    }

    .draft-image-file {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 62px;
      height: 62px;
      border-radius: 0.3rem;
      box-shadow: 0 0 0 1px rgb(221, 221, 221);
      cursor: pointer;

      &:hover {
        & + .multi-file-upload-btn-status {
          opacity: 1;
        }
      }
    }

    .draft-image-file-thumbnail {
      object-fit: cover;
    }

    .multi-file-upload-btn-status {
      position: absolute;
      top: -11px;
      right: -11px;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: rgb(255, 255, 255);
      opacity: 0;

      &:hover {
        opacity: 1;

        .icon-remove {
          color: var(--dark-magenta);
        }
      }

      .icon-remove {
        color: var(--dark-grayish-magenta);
      }
    }
  }

  .toolbar {
    display: flex;
    align-items: center;
    padding-left: 4px;
    height: 40px;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
    background-color: transparent;
    transition: all 0.2s;

    .btn-icon {
      opacity: 0.2;

      &:not(:last-child) {
        margin-right: 1px;
      }
    }
  }

  .slide-enter-active,
  .slide-leave-active {
    overflow: hidden;
    height: 40px;
    transition: all 0.2s;
  }

  .slide-enter,
  .slide-leave-to {
    height: 0;
    opacity: 0;
  }

  .buttons {
    position: absolute;
    right: 4px;

    .btn {
      position: absolute;
      bottom: 4px;
      color: var(--dark-magenta);

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

        .b-icon {
          font-size: 16px;
        }
      }

      &.btn-emoji {
        right: 66px;

        &:hover {
          background: rgba(29, 28, 29, 0.04);

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
      }

      &.btn-mention,
      &.btn-text {
        .b-icon {
          font-size: 19px;
        }
      }

      .b-icon {
        font-size: 14px;
      }
    }
  }

  .notification-bar {
    height: 24px;
  }
}
</style>
