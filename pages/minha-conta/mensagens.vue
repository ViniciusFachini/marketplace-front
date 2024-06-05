<template>
  <main v-if="authenticated">
    <div class="page-wrapper container">
      <ul>
        <li v-for="chat in chats" :key="chat.chat_partner_id">
            {{ chat }}
            <!-- <p>Chat with: {{ chat.chat_partner_id }}</p> -->
        </li>
      </ul>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      chats: [],
      message: '',
      socket: null,
      authenticated: false,
    };
  },
  async created() {
    const { $socket } = this.$nuxt;

    this.socket = $socket;
    this.socket.emit('join', 'user1'); // Replace 'user1' with the actual user ID

    this.socket.on('newMessage', (msg) => {
      // Update the chat list with the new message
      this.updateChatsWithNewMessage(msg);
    });

    // Fetch the last chats
    await this.fetchLastChats();
  },
  methods: {
    async fetchLastChats() {
      try {
        const response = await this.$fetchInfoAuthenticated('messages/last-messages', "GET")
        this.chats = await response;
        console.log(response)
      } catch (error) {
        console.error('Error fetching last chats:', error);
      }
    },
    sendMessage() {
      this.socket.emit('sendMessage', { receiver_id: 'user2', content: this.message }); // Replace 'user2' with the actual receiver ID
      this.message = '';
    },
    async setSessionDeclared() {
      const { session } = await useSession();
      this.session = await session;
    },
    async checkUserAuth() {
      const authenticated = await this.$isAuthenticated();
      let isUserPermited;
      if (authenticated) {
        await this.setSessionDeclared();
        console.log(this.session);
        isUserPermited = true;
      }
      return isUserPermited;
    },
    updateChatsWithNewMessage(msg) {
      const chat = this.chats.find(c => c.chat_partner_id === msg.sender_id);
      if (chat) {
        if (chat.unreadMessages) {
          chat.unreadMessages.push(msg);
        } else {
          chat.lastMessage = msg;
        }
      } else {
        this.chats.push({
          chat_partner_id: msg.sender_id,
          lastMessage: msg
        });
      }
    }
  },
  async mounted() {
    const response = await this.checkUserAuth();
    console.log(response);
    if (response) {
      this.authenticated = true;
    } else {
      this.$router.push("/minha-conta");
    }
  },
};
</script>
<style lang="scss" scoped>
main {
  background-color: #f1f1f1;
}
</style>