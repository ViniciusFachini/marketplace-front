<template>
  <main v-if="authenticated">
    <div class="page-wrapper container">
      <div class="chat-wrapper">
        <aside class="chat-list">
          <h3 class="chat-list__title">Minhas mensagens <span class="quantity">({{ chats.length }})</span></h3>
          <ul>
            <li class="chat-item" v-for="(chat, index) in chats" :key="chat.chat_partner.chat_partner_id"
              @click="selectChat(chat)">
              <div class="item-wrapper"
                :class="index == 0 ? 'top' : index == chats.length - 1 ? 'bottom' : 'middle', chat.messages.unreadMessages && chat.messages.unreadMessages >= 1 ? 'has-unseen-messages' : ''">
                <figure class="chat-item__user-image">
                  <img :src="chat.chat_partner.chat_partner_profile_picture
                    ? treatUserImage(
                      chat.chat_partner.chat_partner_profile_picture
                    )
                    : 'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png'
                    " alt="" />
                </figure>
                <figcaption class="chat-item__user-info">
                  <span class="chat-item__user-info--unseen-badge"
                    v-if="chat.messages.unreadMessages && chat.messages.unreadMessages >= 1">{{
                      chat.messages.unreadMessages }} Mensagens não lidas</span>
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
              </div>
              <!-- {{ chat.chat_partner }} -->
            </li>
          </ul>
        </aside>
        <section class="chat-content">
          <article class="has-chat" v-if="selectedChat && selectedChat[0]">
            <div class="chat-content__user">
              <figure class="chat-item__user-image">
                <img :src="selectedChat[0] && selectedChat[0].sender_profile_picture ? treatUserImage(selectedChat[0].sender_profile_picture) : 'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png'" alt="" />
              </figure>
              <figcaption class="chat-item__user-info">
                <span class="chat-item__user-info--name" v-if="selectedChat[0] && selectedChat[0].sender_name">
                  {{ selectedChat[0].sender_name }}
                </span>
              </figcaption>
            </div>
            <ul class="messages">
              <li class="message" v-for="(item, index) in selectedChat" :class="getBubbleClass(item)" :key="item.id">
                <span class="chat-bubble">
                  {{ item.content }}
                </span>
              </li>
            </ul>
            <form @submit.prevent="sendMessage($event)"></form>
            <input type="text">
          </article>
          <div class="chat-not-selected" v-else>
            Seleciona um chat ae kkkkk
          </div>
        </section>
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
      selectedChat: {}
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
    getBubbleClass(bubble) {
      const currentUserId = this.session.value.user.id
      if (bubble.sender_id == currentUserId) {
        return 'sent'
      } else {
        return 'received'
      }
    },
    selectChat(chat) {
      // Mark the clicked chat as selected
      this.chats.forEach(c => {
        c.selected = (c === chat);
      });

      // Make API request for the selected chat
      this.fetchChatMessages(chat.chat_partner.chat_partner_id);
    },
    async fetchChatMessages(chatPartnerId) {
      try {
        // Make the API request using the chatPartnerId
        // Example:
        const recieverId = this.session.value.user.id
        console.log(chatPartnerId, this.session.value.user.id)
        const response = await this.$fetchInfoAuthenticated(`messages/${chatPartnerId}/${recieverId}`, "GET");
        this.selectedChat = await response
        console.log(this.selectedChat)
        // Handle the response accordingly
      } catch (error) {
        console.error("Error fetching chat messages:", error);
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
    sendMessage(reciever) {
      this.socket.emit("sendMessage", {
        receiver_id: reciever,
        content: this.message,
      }); // Replace 'user2' with the actual receiver ID
      this.message = "";
      console.log(reciever)
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
  padding-block: 40px;

  .chat-wrapper {
    width: 100%;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 400px 1fr;
    align-items: start;
    gap: 20px;

    .chat-list {
      &__title {
        font-size: 24px;
        padding: 16px 12px;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .quantity {
          font-weight: 700;
          font-size: 20px;
        }
      }

      ul {
        background-color: white;
        border-radius: 8px;

        .chat-item {

          .item-wrapper {
            width: 100%;
            display: flex;
            align-items: center;
            padding: 20px;
            justify-content: start;
            gap: 12px;
            transition: all .2s linear;
            cursor: pointer;

            &.top {
              border-radius: 10px 10px 0 0;
            }

            &.bottom {
              border-radius: 0 0 10px 10px;
            }

            &.middle {
              border-radius: 0;
            }

            &.has-unseen-messages {
              background-color: hsl(352, 93%, 90%);
            }

            &:hover {
              background-color: #f83a53;
              color: white;
            }
          }


          &__user-image {
            max-width: 50px;

            img {
              width: 100%;
              border-radius: 50%;
              background-color: white;
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

            &--unseen-badge {
              font-size: 14px;
            }

            &--name {
              font-size: 16px;
              font-weight: 500;
            }

            &--content {
              font-size: 12px;
            }

          }
        }
      }
    }

    .chat-content {
      background-color: white;
      border-radius: 8px;
      height: 100%;
      min-height: 600px;
      max-height: 600px;

      &__user {
        display: flex;
        align-items: center;
        justify-content: start;
        gap: 16px;
        padding: 16px 32px;
        border-bottom: 1px solid #eee;
        figure {
          max-width: 50px;
          img {
            border-radius: 50%;
            background-color: white;
            cursor: pointer;
          }
        }
        figcaption{
          span {
            font-size: 24px;
          }
        }
      }
      
      .has-chat {
        height: 100%;
      }

      .messages {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: end;
        height: 100%;
        padding: 8px;
        max-height: calc(100% - 83px);

        .message {
          display: flex;
          align-items: center;
          width: 100%;

          &.received {
            justify-content: start;
          }

          &.sent {
            justify-content: end;
          }

          .chat-bubble {
            width: 100%;
            max-width: 400px;
          }
        }
      }
    }
  }
}</style>
