<template>
  <main v-if="authenticated">
    <div class="page-wrapper container">
      <div class="chat-wrapper">
        <aside class="chat-list">
          <h3 class="chat-list__title">
            Minhas mensagens <span class="quantity">({{ chats.length }})</span>
          </h3>
          <ul>
            <li
              class="chat-item"
              v-for="(chat, index) in chats"
              :key="chat.chat_partner.chat_partner_id"
              @click="selectChat(chat)"
            >
              <div
                class="item-wrapper"
                :class="[
                  index === 0
                    ? 'top'
                    : index === chats.length - 1
                    ? 'bottom'
                    : 'middle',
                  chat.messages?.unreadMessages &&
                  chat.messages.unreadMessages >= 1
                    ? 'has-unseen-messages'
                    : '',
                  selectedChat &&
                  selectedChat.chat_partner.chat_partner_id ===
                    chat.chat_partner.chat_partner_id
                    ? 'selected'
                    : '',
                ]"
              >
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
                  <span
                    class="chat-item__user-info--unseen-badge"
                    v-if="
                      chat.messages?.unreadMessages &&
                      chat.messages.unreadMessages >= 1
                    "
                  >
                    {{ chat.messages.unreadMessages }} Mensage{{
                      chat.messages.unreadMessages > 1 ? "ns" : "m"
                    }}
                    não lidas
                  </span>
                  <span class="chat-item__user-info--name">
                    {{ chat.chat_partner.chat_partner_name }}
                  </span>
                  <span class="chat-item__user-info--content">
                    {{
                      treatLastMessage(
                        chat.lastMessage
                          ? chat.lastMessage
                          : chat.messages.lastMessage
                      )
                    }}
                  </span>
                  <div class="chat-item__user-info--timestamp">
                    {{
                      formatDate(
                        chat.messages?.lastMessage?.timestamp ||
                          chat.lastMessage.timestamp
                      )
                    }}
                  </div>
                </figcaption>
              </div>
            </li>
          </ul>
        </aside>
        <section class="chat-content">
          <article class="has-chat" v-if="selectedChat">
            <div class="chat-content__user">
              <figure class="chat-item__user-image">
                <img
                  :src="
                    selectedChat.chat_partner.chat_partner_profile_picture
                      ? treatUserImage(
                          selectedChat.chat_partner.chat_partner_profile_picture
                        )
                      : 'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png'
                  "
                  alt=""
                />
              </figure>
              <figcaption class="chat-item__user-info">
                <span class="chat-item__user-info--name">
                  {{ selectedChat.chat_partner.chat_partner_name }}
                </span>
              </figcaption>
            </div>
            <div class="go-to-bottom" @click="scrollToBottom" ref="scrollBottom" v-if="unreadMessagesBelow > 0">
              {{ `Mensagens mais recentes abaixo` }}
            </div>
            <ul ref="messages" class="messages">
              <li
                class="message"
                v-for="item in selectedChat.messages"
                :class="getBubbleClass(item)"
                :key="item.id"
                ref="messagesList"
              >
                <span class="chat-bubble">
                  {{ item.content }}
                </span>
              </li>
            </ul>
            <form
              @submit.prevent="
                sendMessage(selectedChat.chat_partner.chat_partner_id)
              "
            >
              <InputComponent
                type="text"
                class="chatInput"
                v-model="message"
                placeholder="Mensagem..."
              />
              <button type="submit">
                <nuxt-icon name="send-message" />
              </button>
            </form>
          </article>
          <div class="chat-not-selected" v-else>Nenhum chat selecionado</div>
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
      selectedChat: null,
      session: null,
    };
  },
  async created() {
    const response = await this.checkUserAuth();
    if (response) {
      this.authenticated = true;
      this.unreadMessagesBelow = this.calculateUnreadMessagesBelow();
      const { $socket } = this.$nuxt;

      await this.setSessionDeclared();

      this.socket = $socket;
      this.socket.emit(
        "join",
        `${this.session.user.id ? this.session.user.id : ""}`
      ); // Replace 'user1' with the actual user ID

      this.socket.on("messageRead", (messageId) => {
        // Update the message status to indicate that it has been read
        const message = this.selectedChat.messages.find(
          (message) => message.id === messageId
        );
        if (message) {
          message.read = true;
        }
        console.log(message);
      });

      this.socket.on("newMessage", (msg) => {
        // Update the chat list with the new message
        this.updateChatsWithNewMessage(msg);
        // this.scrollToBottom();
      });

      // Fetch the last chats
      await this.fetchLastChats();
    } else {
      this.$router.push("/minha-conta");
    }
  },
  methods: {
    async fetchLastChats() {
      try {
        const response = await this.$fetchInfoAuthenticated(
          "messages/last-messages",
          "GET"
        );
        this.chats = response;
      } catch (error) {
        console.error("Error fetching last chats:", error);
      }
    },
    async getLastMessage(chatPartnerId) {
      try {
        const response = await this.$fetchInfoAuthenticated(
          `messages/${chatPartnerId}/last`,
          "GET"
        );
        return response;
      } catch (error) {
        console.error("Error fetching last message for chat:", error);
        return null;
      }
    },
    calculateUnreadMessagesBelow() {
      const messagesContainer = this.$refs.messages;
      if (messagesContainer) {
        const difference =
          messagesContainer.scrollHeight -
          messagesContainer.scrollTop -
          messagesContainer.clientHeight;

        if (difference <= 200) {
          // If the difference is smaller than or equal to 30px, scroll to the bottom
          this.scrollToBottom();
          return 0;
        } else {
          // If the difference is greater than 30px, return the difference
          return difference;
        }
      }
      return 0;
    },
    getBubbleClass(bubble) {
      if (!this.session || !this.session || !this.session.user) {
        return "received"; // Default class if session data is not available
      }
      const currentUserId = this.session.user.id;
      return bubble.sender_id == currentUserId ? "sent" : "received";
    },
    selectChat(chat) {
      this.selectedChat = chat;
      this.fetchChatMessages(chat.chat_partner.chat_partner_id);
      
    },
    async fetchChatMessages(chatPartnerId) {
      try {
        // Fetch messages from the server
        const messages = await this.$fetchInfoAuthenticated(
          `messages/${chatPartnerId}/${this.session.user.id}`,
          "GET"
        );

        // Check if the response is an array
        if (Array.isArray(messages)) {
          // Filter unread messages
          const unreadMessages = messages.filter((message) => !message.is_read);

          // Mark unread messages as read
          await Promise.all(
            unreadMessages.map(async (message) => {
              // Mark the message as read in the database
              await this.$fetchInfoAuthenticated(
                `messages/${message.id}/read`,
                "PATCH"
              );
            })
          );

          // Update the specific chat with the messages and lastMessage
          const chatIndex = this.chats.findIndex(
            (chat) => chat.chat_partner.chat_partner_id === chatPartnerId
          );
          if (chatIndex !== -1) {
            this.chats[chatIndex].lastMessage = messages
              ? messages[messages.length - 1]
              : null;
            this.chats[chatIndex].messages = messages;
            console.log(this.chats[chatIndex]);
          }
        } else {
          console.error(
            "Error fetching chat messages: Invalid response format"
          );
        }
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMilliseconds = now - date;
      const diffInHours = diffInMilliseconds / (1000 * 60 * 60);

      if (diffInHours < 24) {
        return date.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        });
      } else {
        return date.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        });
      }
    },
    truncateText(text) {
      const maxLength = 30; // Adjust the maximum length as needed
      return text && text.length > maxLength
        ? text.substring(0, maxLength) + "..."
        : text;
    },
    treatLastMessage(message) {
      const authenticatedUserId = this.session.user.id;
      const messageContent = this.truncateText(message ? message.content : "");
      if (
        authenticatedUserId &&
        message &&
        message.sender_id === authenticatedUserId
      ) {
        return `Você: ${messageContent}`;
      } else {
        return messageContent;
      }
    },
    async sendMessage(receiver) {
      try {
        const response = await this.$fetchInfoAuthenticated(
          `messages`,
          "POST",
          {
            receiver_id: receiver,
            content: this.message,
          }
        );

        const sentMessage = {
          id: response.id,
          content: this.message,
          sender_id: this.session.user.id,
          timestamp: new Date().toISOString(),
        };

        // Update local state with the sent message
        if (this.selectedChat && this.selectedChat.messages) {
          this.selectedChat.messages.push(sentMessage);
          this.selectedChat.lastMessage = sentMessage;

          // Update the corresponding chat in the chat list
          const chatIndex = this.chats.findIndex(
            (chat) => chat.chat_partner.chat_partner_id === receiver
          );
          if (chatIndex !== -1) {
            this.chats[chatIndex].lastMessage = sentMessage;
          }
        }

        // Emit the message via socket
        this.socket.emit("sendMessage", {
          receiver_id: receiver,
          content: this.message,
        });

        // Clear the message input after sending
        this.message = "";

        // Scroll to bottom after sending message
        this.scrollToBottom();
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    treatUserImage(imageUrl) {
      const runtimeConfig = useRuntimeConfig();
      return `${runtimeConfig.public.serverUrl}/uploads/users/${imageUrl}`;
    },
    async setSessionDeclared() {
      const { session } = await useSession();
      this.session = session;
    },
    async checkUserAuth() {
      const authenticated = await this.$isAuthenticated();
      if (authenticated) {
        await this.setSessionDeclared();
        return true;
      }
      return false;
    },
    scrollToBottom() {
      const messages = this.$refs.messages;
      if (messages) {
        this.$nextTick(() => {
          messages.scrollTop = messages.scrollHeight;
        });
      }
      const show = this.$refs.scrollBottom
      console.log(!show)
      if(show) {
        console.log(show)
        show.classList.add('active')
        console.log(show)
      }
    },
    updateChatsWithNewMessage(msg) {
      // Check if the sender's ID matches the ID of the selected chat partner
      if (
        this.selectedChat &&
        msg.sender_id === this.selectedChat.chat_partner.chat_partner_id
      ) {
        const existingChat = this.chats.find(
          (c) => c.chat_partner.chat_partner_id === msg.sender_id
        );
        if (existingChat) {
          if (existingChat.messages) {
            existingChat.messages.push(msg);
          } else {
            existingChat.messages = [msg];
          }
          // Call scrollToBottom after updating the messages
          // this.scrollToBottom();
        } else {
          this.chats.push({
            chat_partner: {
              chat_partner_id: msg.sender_id,
              chat_partner_name: msg.sender_name,
              chat_partner_profile_picture: msg.sender_profile_picture,
            },
            messages: [msg],
          });
          // Call scrollToBottom after updating the messages
          // this.scrollToBottom();
        }
      }
      this.unreadMessagesBelow = this.calculateUnreadMessagesBelow();
      const show = this.$refs.scrollBottom
      console.log(show)
      if(show) {
        console.log(show)
        show.classList.remove('active')
        console.log(show)
      }
    },
  },
};
</script>


<style lang="scss" scoped>
main {
  background-color: #f1f1f1;
}

.chat-not-selected {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-wrapper {
  padding-block: 40px;

  .chat-wrapper {
    width: 100%;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 30% 70%;
    align-items: start;
    gap: 20px;

    @media screen and (max-width: 992px) {
      width: 100%;
      max-width: 100%;
      display: flex;
      flex-direction: column;
    }

    .chat-list {
      width: 100%;
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
            transition: all 0.2s linear;
            cursor: pointer;

            &.selected {
              background-color: #f83a53;
              color: white;
            }

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
              transform: translateY(-50%) translateY(-2px);
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
      display: flex;
      flex-direction: column;
      width: 100%;

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
        figcaption {
          span {
            font-size: 24px;
          }
        }
      }

      .has-chat {
        flex-grow: 1;
        display: flex;
        overflow-y: hidden;
        flex-direction: column;
        position: relative;

        .go-to-bottom {
          position: absolute;
          bottom: 50px;
          left: 50%;
          transform: translateX(-50%);
          background-color: white;
          padding: 8px 32px;
          border-radius: 4px;
          box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
          color: #4242fa;
          font-size: 16px;
          cursor: pointer;
          transition: all .3s linear;
          &.active {
            bottom: 0;
            opacity: 0;
            visibility: hidden;
          }
          &:hover {
            text-decoration: underline;
            text-underline-offset: 2px;
            color: #6d6dd8;
          }
        }

        form {
          display: flex;
          align-items: stretch;
          justify-content: center;
          border-top: 1px solid #ccc;
          .chatInput {
            max-height: 40px;
          }
          button {
            border: none;
            padding-inline: 20px;

            color: #ccc;
            cursor: pointer;
            background: transparent;
            span {
              width: 24px;
            }
          }
        }

        .messages {
          flex-grow: 1;
          overflow-y: auto;
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          scroll-behavior: smooth;

          &::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
            background-color: #f5f5f5;
            border-radius: 0 0 0 0;
          }

          &::-webkit-scrollbar {
            width: 8px;
            background-color: #f5f5f5;
            border-radius: 0 0 0 0;
          }

          &::-webkit-scrollbar-thumb {
            background-color: #949494;
            border: 1px solid #a1a1a1;
            border-radius: 0 0 0 0;
          }

          .message {
            display: flex;
            align-items: center;
            width: 100%;
            max-width: 960px;

            &.received {
              justify-content: start;
            }

            &.sent {
              justify-content: end;
            }

            .chat-bubble {
              background-color: #e0e0e0;
              padding: 10px;
              border-radius: 10px;
              max-width: 60%;
              word-wrap: break-word;
            }
          }
        }
      }
    }
  }
}
</style>