<template>
  <div>
    <ChatNavBar />

    <b-container fluid>
      <b-row>
        <b-col cols="2">
          <ChannelList />
        </b-col>

        <b-col cols="8">
          <b-row>
            <b-col id="chat-content">
              <MessageList :messages="messages" />
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <MessageForm :username="username" />
            </b-col>
          </b-row>
        </b-col>

        <b-col cols="2">
          <MemberList />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import ChatNavBar from '@/components/ChatNavBar'
import ChannelList from '@/components/ChannelList'
import MessageList from '@/components/MessageList'
import MessageForm from '@/components/MessageForm'
import MemberList from '@/components/MemberList'

import { database } from '@/firebase.config'
import moment from 'moment'

export default {
  name: 'Chat',
  components: {
    ChatNavBar,
    ChannelList,
    MessageList,
    MessageForm,
    MemberList
  },
  props: {
    username: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      messages: []
    }
  },
  created() {
    const ref = database.collection('messages').orderBy('timestamp')

    ref.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type == 'added') {
          let doc = change.doc

          this.messages.push({
            id: doc.id,
            text: doc.data().message,
            date: moment(doc.data().timestamp).format('dddd LT'),
            username: doc.data().username
          })
        }
      })
    })
  }
}
</script>
