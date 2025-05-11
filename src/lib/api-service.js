/**
 * API service for handling all API calls
 */

// Auth API calls
export const authService = {
  // Login user
  async login(email, password) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Login failed');
      }
      
      return await res.json();
    } catch (error) {
      throw error;
    }
  },
  
  // Register user
  async register(name, email, password) {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Registration failed');
      }
      
      return await res.json();
    } catch (error) {
      throw error;
    }
  },
  
  // Get current user
  async getCurrentUser() {
    try {
      const res = await fetch('/api/auth/me');
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to fetch user');
      }
      
      return await res.json();
    } catch (error) {
      throw error;
    }
  },
  
  // Logout user
  async logout() {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Logout failed');
      }
      
      return true;
    } catch (error) {
      throw error;
    }
  },
};

// Friends API calls
export const friendsService = {
  // Get all friends and friend requests
  async getFriends() {
    try {
      const res = await fetch('/api/friends');
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to fetch friends');
      }
      
      return await res.json();
    } catch (error) {
      throw error;
    }
  },
  
  // Search for users
  async searchUsers(query) {
    try {
      const res = await fetch(`/api/friends/search?query=${encodeURIComponent(query)}`);
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to search users');
      }
      
      return await res.json();
    } catch (error) {
      throw error;
    }
  },
  
  // Send friend request
  async addFriend(addresseeId) {
    try {
      const res = await fetch('/api/friends/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresseeId }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to send friend request');
      }
      
      return await res.json();
    } catch (error) {
      throw error;
    }
  },
  
  // Accept/reject friend request
  async respondToRequest(friendshipId, status) {
    try {
      const res = await fetch('/api/friends/respond', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendshipId, status }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to respond to friend request');
      }
      
      return await res.json();
    } catch (error) {
      throw error;
    }
  },
};

// Messages API calls
export const messagesService = {
  // Get messages with a friend
  async getMessages(friendId) {
    try {
      const res = await fetch(`/api/messages/${friendId}`);
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to fetch messages');
      }
      
      return await res.json();
    } catch (error) {
      throw error;
    }
  },
  
  // Send message to a friend
  async sendMessage(friendId, content) {
    try {
      const res = await fetch(`/api/messages/${friendId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to send message');
      }
      
      return await res.json();
    } catch (error) {
      throw error;
    }
  },
};
