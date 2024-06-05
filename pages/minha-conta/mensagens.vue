<template>
  <main v-if="authenticated">
    <div class="page-wrapper container">
      <div class="chat-wrapper">
        <aside class="chat-list">
          <ul>
            <li
              class="chat-item"
              v-for="chat in chats"
              :key="chat.chat_partner.chat_partner_id"
            >
              <!-- {{ chat.chat_partner }} -->
              <figure class="chat-item__user-image">
                <img
                  :src="
                    chat.chat_partner.chat_partner_profile_picture
                      ? treatUserImage(
                          chat.chat_partner.chat_partner_profile_picture
                        )
                      : 'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png'
                  "
                  alt=""
                />
              </figure>
              <figcaption class="chat-item__user-info">
                <span class="chat-item__user-info--name">
                  {{ chat.chat_partner.chat_partner_name }}
                </span>
                <span class="chat-item__user-info--content">
                  {{ truncateText(chat.messages.lastMessage.content) }}
                </span>
                <div class="chat-item__user-info--timestamp">
                  {{ formatDate(chat.messages.lastMessage.timestamp) }}
                </div>
              </figcaption>
              <!-- <p>Chat with: {{ chat.chat_partner_id }}</p> -->
            </li>
          </ul>
        </aside>
        <section class="chat-content"></section>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      chats: [],
      message: "",
      socket: null,
      authenticated: false,
    };
  },
  async created() {
    const { $socket } = this.$nuxt;

    this.socket = $socket;
    this.socket.emit("join", "user1"); // Replace 'user1' with the actual user ID

    this.socket.on("newMessage", (msg) => {
      // Update the chat list with the new message
      this.updateChatsWithNewMessage(msg);
    });

    // Fetch the last chats
    await this.fetchLastChats();
    console.log(this.chats);
  },
  methods: {
    async fetchLastChats() {
      try {
        const response = await this.$fetchInfoAuthenticated(
          "messages/last-messages",
          "GET"
        );
        this.chats = await response;
        console.log(response);
        // Treat names after fetching chats
        await this.treatAllUserNames();
      } catch (error) {
        console.error("Error fetching last chats:", error);
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMilliseconds = now - date;
      const diffInHours = diffInMilliseconds / (1000 * 60 * 60);

      if (diffInHours < 24) {
        const hour = date.getHours().toString().padStart(2, "0");
        const minute = date.getMinutes().toString().padStart(2, "0");
        return `${hour}:${minute}`;
      } else {
        return "yesterday";
      }
    },
    truncateText(text) {
      const maxLength = 30; // Adjust the maximum length as needed
      return text.length > maxLength
        ? text.substring(0, maxLength) + "..."
        : text;
    },
    sendMessage() {
      this.socket.emit("sendMessage", {
        receiver_id: "user2",
        content: this.message,
      }); // Replace 'user2' with the actual receiver ID
      this.message = "";
    },
    async treatUserName(name) {
      const nameParts = name.split(" ");
      if (nameParts.length > 2) {
        const treatedName = nameParts[0] + nameParts[nameParts.length - 1];
        return treatedName;
      } else {
        return name;
      }
    },
    treatUserImage(imageUrl) {
      return `http://localhost:3001/uploads/users/${imageUrl}`;
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
      const chat = this.chats.find((c) => c.chat_partner_id === msg.sender_id);
      if (chat) {
        if (chat.unreadMessages) {
          chat.unreadMessages.push(msg);
        } else {
          chat.lastMessage = msg;
        }
      } else {
        this.chats.push({
          chat_partner_id: msg.sender_id,
          lastMessage: msg,
        });
      }
    },
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
.page-wrapper {
  .chat-wrapper {
    width: 100%;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 400px 1fr;
    .chat-list {
      ul {
        .chat-item {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: start;
          gap: 12px;
          &__user-image {
            max-width: 50px;
            img {
              width: 100%;
              border-radius: 50%;
            }
          }
          &__user-info {
            display: flex;
            flex-direction: column;
            align-items: start;
            width: 100%;
            justify-content: center;
            gap: 4px;
            position: relative;
            &--timestamp {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              right: 0;
            }
          }
        }
      }
    }
  }
}
</style>
