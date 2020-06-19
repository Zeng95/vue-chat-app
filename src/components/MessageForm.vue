<template>
  <div class="message-form">
    <div
      class="message-input position-relative"
      :class="{ focus: messageFormFocused }"
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
                v-bind="{ blank: true, width: '100%', height: '100%' }"
                blank-color="rgb(248, 248, 248)"
                class="draft-image-file-thumbnail w-100 h-100"
                alt="Thumbnail Image"
              />
              <b-spinner
                small
                variant="primary"
                label="Spinning"
                style="border-width: 0.1rem;"
              ></b-spinner>
            </div>
            <b-button
              variant="transparent"
              class="btn-unstyled multi-file-upload-btn-status multi-file-upload-btn-status-remove"
              v-b-tooltip.hover
              title="Remove file"
            >
              <b-icon-x-circle-fill class="icon-remove" v-if="false" />
              <b-spinner
                small
                variant="primary"
                label="Spinning"
                style="border-width: 0.1rem;"
              ></b-spinner>
            </b-button>
          </div>
        </div>
      </div>

      <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
        <div class="menubar">
          <div class="toolbar h-100">
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

          <div class="buttons position-absolute">
            <!-- Send message -->
            <b-button
              v-b-tooltip.hover
              title="Send message"
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
                v-b-tooltip.hover
                title="Attach file"
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
                ref="file"
                v-model="files"
                plain
                hidden
                @input="uploadFile"
              ></b-form-file>
            </div>

            <!-- Emoji -->
            <div id="emoji">
              <b-button
                v-b-tooltip.hover
                title="Emoji"
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
                @hide="hideEmjoiPicker"
              />
            </div>

            <!-- Mention -->
            <b-button
              v-b-tooltip.hover
              title="Mention someone"
              variant="transparent"
              class="btn-icon btn-mention btn-unstyled"
            >
              <b-icon-at />
            </b-button>

            <!-- Hide formatting -->
            <b-button
              v-b-tooltip.hover
              title="Hide formatting"
              variant="transparent"
              class="btn-icon btn-text btn-unstyled"
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
      previewImages: null,
      message: null,
      messageFormFocused: true,

      emojiPickerShow: false,
      emojiPickerFocused: false,

      // Create a root reference
      storageRef: storage.ref(),
      fileUploadShow: false,
      fileUploadTask: null,

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
        focusMessageForm: () => {
          if (this.emojiPickerShow) {
            this.emojiPickerShow = false
            this.editor.focus()
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
    selectFile() {
      this.$refs.file.$el.click()
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
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100

          this.$emit('get-progress', { progress, fileName: this.files.name })
        },
        error => {
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

      reader.onload = e => (this.previewImages = e.target.result)
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
        this.showEmjoiPicker()
      } else {
        this.hideEmjoiPicker()
      }
    },
    showEmjoiPicker() {
      this.emojiPickerShow = true
      this.emojiPickerFocused = true

      this.messageFormFocused = false
    },
    hideEmjoiPicker() {
      this.emojiPickerShow = false

      this.messageFormFocused = true
      this.editor.focus()
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

    &.focus {
      &::after {
        position: absolute;
        bottom: 40px;
        left: 0;
        display: block;
        width: 100%;
        height: 1px;
        background-color: rgb(221, 221, 221);
        content: '';
      }

      .menubar {
        background-color: rgb(248, 248, 248);
      }

      .btn-icon {
        opacity: 1;
        pointer-events: all;
      }

      .buttons {
        .btn-text {
          background-color: rgba(29, 28, 29, 0.13);
          color: rgb(29, 28, 29);
          opacity: 1;
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

  .editor {
    margin: 7px 0 11px;
    padding: 4px 0 0 10px;
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

      &:hover {
        .icon-remove {
          color: var(--dark-magenta);
        }
      }

      .icon-remove {
        color: var(--dark-grayish-magenta);
      }
    }
  }

  .menubar {
    position: relative;
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

    .btn-icon {
      opacity: 0.2;

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

        &:hover {
          background-color: rgba(29, 28, 29, 0.2);
        }
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
