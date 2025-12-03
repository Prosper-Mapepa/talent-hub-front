import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../apiClient';
import { RootState } from '../store';

// Types
export interface Message {
  id: string;
  content: string;
  senderId: string;
  conversationId: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: any[];
  createdAt: string;
  updatedAt: string;
}

export interface MessagesState {
  conversations: Conversation[];
  messages: { [conversationId: string]: Message[] };
  isLoading: boolean;
  error: string | null;
}

const initialState: MessagesState = {
  conversations: [],
  messages: {},
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchConversations = createAsyncThunk(
  'messages/fetchConversations',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/conversations?userId=${userId}`);
      console.log('Fetch conversations API response:', response.data);
      return response.data.data.data || response.data.data; // Return just the conversations array
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch conversations'
      );
    }
  }
);

export const createConversation = createAsyncThunk(
  'messages/createConversation',
  async (participantIds: string[], { dispatch, rejectWithValue }) => {
    try {
      const response = await apiClient.post('/conversations', { participantIds });
      console.log('Create conversation API response:', response.data);
      const conversation = response.data.data.data || response.data.data;
      // Fetch messages for the new conversation
      if (conversation && conversation.id) {
        dispatch(fetchMessages(conversation.id));
      }
      return conversation; // Return just the conversation object
    } catch (error: any) {
      console.error('Failed to create conversation:', error.response?.data || error);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create conversation'
      );
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/conversations/${conversationId}/messages`);
      console.log('Fetch messages API response:', response.data);
      return { conversationId, messages: response.data.data || response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch messages'
      );
    }
  }
);

// Update the sendMessage thunk to immediately add the message to state
export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ conversationId, content }: { conversationId: string; content: string }, { getState, dispatch }) => {
    const state = getState() as RootState;
    const user = state.auth.user;
    
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    // Create a temporary message for immediate display
    const tempMessage = {
      id: `temp-${Date.now()}`,
      content,
      senderId: user.id,
      conversationId,
      createdAt: new Date().toISOString(),
      isPending: true
    };

    // Immediately add the temporary message to state
    dispatch(messagesSlice.actions.addTempMessage({ conversationId, message: tempMessage }));

    try {
      const response = await apiClient.post(`/conversations/${conversationId}/messages`, {
        content,
        senderId: user.id
      });

      console.log('Send message response:', response.data);
      
      // Return the real message to replace the temp one
      return {
        conversationId,
        tempId: tempMessage.id,
        message: response.data.data || response.data
      };
    } catch (error: any) {
      console.error('Send message error:', error);
      // Remove the temp message on error
      dispatch(messagesSlice.actions.removeTempMessage({ conversationId, tempId: tempMessage.id }));
      throw new Error(error.response?.data?.message || 'Failed to send message');
    }
  }
);

// Add this new action to handle immediate message display
export const addMessageToConversation = createAsyncThunk(
  'messages/addMessageToConversation',
  async ({ conversationId, message }: { conversationId: string; message: any }, { getState }) => {
    return { conversationId, message };
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessages: (state, action: PayloadAction<string>) => {
      delete state.messages[action.payload];
    },
    addTempMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(message);
    },
    removeTempMessage: (state, action) => {
      const { conversationId, tempId } = action.payload;
      if (state.messages[conversationId]) {
        state.messages[conversationId] = state.messages[conversationId].filter(
          msg => msg.id !== tempId
        );
      }
    },
    replaceTempMessage: (state, action) => {
      const { conversationId, tempId, message } = action.payload;
      if (state.messages[conversationId]) {
        const index = state.messages[conversationId].findIndex(msg => msg.id === tempId);
        if (index !== -1) {
          state.messages[conversationId][index] = message;
        }
      }
    },
    addMessageToConversation: (state, action) => {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(message);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        if (!state.conversations) {
          state.conversations = [];
        }
        state.conversations.push(action.payload);
      })
      .addCase(fetchMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages[action.payload.conversationId] = action.payload.messages;
        state.error = null;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { conversationId, message } = action.payload;
        
        // Add the new message to the conversation
        if (!state.messages[conversationId]) {
          state.messages[conversationId] = [];
        }
        state.messages[conversationId].push(message);
        
        // Update the conversation's updatedAt timestamp
        const conversation = state.conversations.find(c => c.id === conversationId);
        if (conversation) {
          conversation.updatedAt = message.createdAt;
        }
      });
  },
});

export const { clearError, clearMessages } = messagesSlice.actions;
export default messagesSlice.reducer; 