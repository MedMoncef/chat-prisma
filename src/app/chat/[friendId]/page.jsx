'use client';

import { useState, useEffect, useRef } from 'react';
import { Avatar, Button, Spinner } from '@/components/ui';
import useStore from '@/lib/store';
import { format } from 'date-fns';

export default function ChatPage({ params }) {
  const { friendId } = params;
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  
  const {
    currentUser,
    friends,
    messages,
    selectedFriend,
    selectFriend,
    setMessages,
    addMessage,
  } = useStore();
  
  // Load messages and set selected friend
  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      
      // Find the friend in our list
      const friend = friends.find(f => f.id === friendId);
      
      if (friend && (!selectedFriend || selectedFriend.id !== friendId)) {
        selectFriend(friend);
      }
      
      try {
        const res = await fetch(`/api/messages/${friendId}`);
        
        if (!res.ok) {
          throw new Error('Failed to load messages');
        }
        
        const data = await res.json();
        setMessages(data.messages);
      } catch (error) {
        console.error('Failed to load messages', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMessages();
  }, [friendId, friends]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || !selectedFriend) return;
    
    try {
      const res = await fetch(`/api/messages/${selectedFriend.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: message }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to send message');
      }
      
      const newMessage = await res.json();
      addMessage(newMessage);
      setMessage('');
    } catch (error) {
      console.error('Send message error', error);
    }
  };
  
  if (!selectedFriend) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>Select a friend to start chatting</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="p-4 border-b flex items-center bg-white shadow-sm">
        <Avatar name={selectedFriend.name} />
        <div className="ml-3">
          <h3 className="font-medium">{selectedFriend.name}</h3>
          <p className="text-xs text-gray-500">{selectedFriend.email}</p>
        </div>
      </div>
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {isLoading ? (
          <div className="flex justify-center mt-4">
            <Spinner />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-4">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map(msg => {
              const isMe = msg.senderId === currentUser?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs sm:max-w-md md:max-w-lg px-4 py-2 rounded-lg ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none shadow'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className={`text-xs mt-1 ${isMe ? 'text-blue-200' : 'text-gray-500'}`}>
                      {format(new Date(msg.createdAt), 'HH:mm')}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Message input */}
      <div className="p-3 bg-white border-t">
        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit" className="rounded-l-none">
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
