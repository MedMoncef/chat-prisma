import { create } from 'zustand';

export type User = {
  id: string;
  name: string;
  email: string;
};

export type Friend = {
  id: string;
  name: string;
  email: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  isRequester?: boolean;
};

export type Message = {
  id: string;
  content: string;
  createdAt: Date;
  senderId: string;
  receiverId: string;
};

type ChatState = {
  currentUser: User | null;
  selectedFriend: Friend | null;
  friends: Friend[];
  friendRequests: Friend[];
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  
  // Auth actions
  login: (user: User) => void;
  logout: () => void;
  
  // Friend actions
  setFriends: (friends: Friend[]) => void;
  setFriendRequests: (requests: Friend[]) => void;
  selectFriend: (friend: Friend | null) => void;
  
  // Message actions
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  
  // UI state
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
};

const useStore = create<ChatState>((set) => ({
  currentUser: null,
  selectedFriend: null,
  friends: [],
  friendRequests: [],
  messages: [],
  isLoading: false,
  error: null,
  
  // Auth actions
  login: (user) => set({ currentUser: user }),
  logout: () => set({ 
    currentUser: null,
    selectedFriend: null,
    friends: [],
    friendRequests: [],
    messages: []
  }),
  
  // Friend actions
  setFriends: (friends) => set({ friends }),
  setFriendRequests: (friendRequests) => set({ friendRequests }),
  selectFriend: (selectedFriend) => set({ selectedFriend }),
  
  // Message actions
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  
  // UI state
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => {
    set({ error });
    // Clear error after 5 seconds
    if (error) {
      setTimeout(() => {
        set({ error: null });
      }, 5000);
    }
  },
}));

export default useStore;
