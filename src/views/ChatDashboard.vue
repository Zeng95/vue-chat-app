<template>
  <div>
    <b-container>
      <b-row>
        <b-col cols="2">
          <RoomList />
        </b-col>

        <b-col cols="8">
          <MessageList />
        </b-col>

        <b-col cols="2">
          <UserList />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import RoomList from '@/components/RoomList'
import UserList from '@/components/UserList'
import MessageList from '@/components/MessageList'

export default {
  components: {
    RoomList,
    UserList,
    MessageList
  }
}
</script>

<style lang="scss" scoped></style>
