'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, Button, Spinner } from '@/components/ui';
import useStore from '@/lib/store';

export default function ChatLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  const router = useRouter();
  const {
    currentUser,
    friends,
    friendRequests,
    selectedFriend,
    logout: storeLogout,
    login,
    setFriends,
    setFriendRequests,
    selectFriend,
  } = useStore();
  
  // Load user and friends on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch current user
        const userRes = await fetch('/api/auth/me');
        
        if (!userRes.ok) {
          throw new Error('Failed to load user');
        }
        
        const userData = await userRes.json();
        login(userData);
        
        // Fetch friends and requests
        const friendsRes = await fetch('/api/friends');
        
        if (!friendsRes.ok) {
          throw new Error('Failed to load friends');
        }
        
        const friendsData = await friendsRes.json();
        setFriends(friendsData.friends);
        setFriendRequests(friendsData.pendingRequests);
        
        // Select first friend by default if available
        if (friendsData.friends.length > 0 && !selectedFriend) {
          selectFriend(friendsData.friends[0]);
        }
      } catch (error) {
        console.error('Failed to load user data', error);
        // Handle authentication errors
        logout();
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, []);
  
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
      });
      storeLogout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error', error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="large" />
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg"
        >
          {showMobileSidebar ? 'X' : '☰'}
        </button>
      </div>
      
      {/* Sidebar */}
      <div 
        className={`w-72 bg-white border-r border-gray-200 flex flex-col
                   ${showMobileSidebar ? 'fixed inset-0 z-40' : 'hidden'} md:flex`}
      >
        {/* User profile */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <Avatar name={currentUser?.name} />
            <div className="ml-3">
              <h3 className="font-medium">{currentUser?.name}</h3>
              <p className="text-xs text-gray-500">{currentUser?.email}</p>
            </div>
          </div>
          <div className="mt-4">
            <Button 
              variant="outline" 
              fullWidth
              onClick={() => router.push('/chat/add')}
            >
              Add Friend
            </Button>
          </div>
        </div>
        
        {/* Friend requests */}
        {friendRequests.length > 0 && (
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
              Friend Requests ({friendRequests.length})
            </h3>
            <div className="space-y-2">
              {friendRequests.map(request => (
                <div 
                  key={request.id}
                  className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  onClick={() => router.push(`/chat/requests`)}
                >
                  <div className="flex items-center">
                    <Avatar name={request.name} size="small" />
                    <div className="ml-2">
                      <p className="text-sm font-medium">{request.name}</p>
                      <p className="text-xs text-gray-500">
                        {request.isRequester ? 'Request sent' : 'Wants to connect'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Friends list */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
            Friends ({friends.length})
          </h3>
          
          {friends.length === 0 ? (
            <p className="text-sm text-gray-500 text-center mt-4">
              No friends yet. Add some friends!
            </p>
          ) : (
            <div className="space-y-1">
              {friends.map(friend => (
                <div
                  key={friend.id}
                  className={`p-2 rounded-lg cursor-pointer flex items-center
                              ${selectedFriend?.id === friend.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  onClick={() => {
                    selectFriend(friend);
                    setShowMobileSidebar(false);
                    router.push(`/chat/${friend.id}`);
                  }}
                >
                  <Avatar name={friend.name} size="small" />
                  <div className="ml-2">
                    <p className="text-sm font-medium">{friend.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="outline"
            fullWidth
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
