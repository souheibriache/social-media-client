import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type MessageType = {
  content: string;
  timestamp: Date;
  seenAt: Date;
  sender: {
    _id: string;
    userName: string;
    profile: {
      picture: string;
    };
  };
};

export type ChatType = {
  _id: string;
  messages: MessageType[];
  isMinimized: boolean;
  recipient: {
    _id: string;
    userName: string;
    profile: {
      picture: string;
    };
  };
};

export type ChatState = {
  loading: boolean;
  error: boolean;
  chatSessions: ChatType[];
};

const initialState: ChatState = {
  error: false,
  loading: false,
  chatSessions: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    openChat(state: any, action: PayloadAction<any>) {
      state.loading = false;
      state.error = false;
      const existingChat = state.chatSessions.filter(
        (chatSession: any) => chatSession._id === action.payload.chat._id
      );

      if (existingChat.length) {
        console.log({ existingChat });
        for (const chat of state.chatSessions) {
          console.log({
            chatId: chat._id,
            payloadChatId: action.payload.chat._id,
          });
          if (chat._id === action.payload.chat._id) chat.isMinimized = false;
        }
      } else state.chatSessions.push(action.payload.chat);
    },
    closeChat(state: any, action: PayloadAction<any>) {
      state.loading = false;
      state.error = false;
      console.log({ closeChatChatId: action.payload.chatId });
      state.chatSessions = state.chatSessions.filter((chat: any) => {
        chat._id === action.payload.chatId;
      });
    },
    toggleChatVisibility(state: any, action: PayloadAction<any>) {
      state.loading = false;
      state.error = false;
      for (const chat of state.chatSessions) {
        if (chat._id === action.payload.chatId)
          chat.isMinimized = action.payload.isMinimized;
      }
    },
    sendMessage(state: any, action: PayloadAction<any>) {
      state.loading = false;
      state.error = false;
      for (const chat of state.chatSessions) {
        if (chat._id === action.payload.chatId)
          chat.messages.push(action.payload.message);
      }
    },
    resetChat(state: any) {
      (state.loading = false), (state.error = false), (state.chatSessions = []);
    },
  },
});

export const {
  openChat,
  closeChat,
  toggleChatVisibility,
  sendMessage,
  resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;
