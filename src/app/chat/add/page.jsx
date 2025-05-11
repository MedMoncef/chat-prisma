'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Card, Spinner, Avatar } from '@/components/ui';

export default function AddFriendPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Search for users
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch(`/api/friends/search?query=${encodeURIComponent(searchQuery)}`);
      
      if (!res.ok) {
        throw new Error('Failed to search users');
      }
      
      const data = await res.json();
      setSearchResults(data.users);
    } catch (error) {
      console.error('Search error', error);
      setError('Failed to search for users');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle "Enter" key press
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && searchQuery.trim()) {
        handleSearch();
      }
    };
    
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [searchQuery]);
  
  // Send friend request
  const sendFriendRequest = async (userId) => {
    try {
      const res = await fetch('/api/friends/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ addresseeId: userId }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to send friend request');
      }
      
      // Update the search results to reflect the sent request
      setSearchResults(prevResults =>
        prevResults.map(user =>
          user.id === userId
            ? { ...user, friendshipStatus: 'PENDING', isRequester: true }
            : user
        )
      );
    } catch (error) {
      console.error('Send friend request error', error);
      setError('Failed to send friend request');
    }
  };
  
  const getFriendshipStatusLabel = (user) => {
    if (!user.friendshipStatus) return null;
    
    switch (user.friendshipStatus) {
      case 'PENDING':
        return user.isRequester ? 'Request sent' : 'Respond to request';
      case 'ACCEPTED':
        return 'Already friends';
      case 'REJECTED':
        return 'Request rejected';
      default:
        return null;
    }
  };
  
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Friends</h1>
      
      <Card>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search by name or email
          </label>
          <div className="flex">
            <Input
              name="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter name or email"
            />
            <Button
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isLoading}
              className="ml-2"
            >
              {isLoading ? <Spinner size="small" /> : 'Search'}
            </Button>
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <div className="mt-4">
          {searchResults.length > 0 ? (
            <div className="space-y-4">
              {searchResults.map((user) => (
                <div 
                  key={user.id} 
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <Avatar name={user.name} />
                    <div className="ml-3">
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  
                  {user.friendshipStatus ? (
                    <span className="text-sm text-gray-600">
                      {getFriendshipStatusLabel(user)}
                    </span>
                  ) : (
                    <Button
                      onClick={() => sendFriendRequest(user.id)}
                    >
                      Add Friend
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : searchQuery && !isLoading ? (
            <p className="text-center text-gray-500">No users found</p>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
