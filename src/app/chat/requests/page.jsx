'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Spinner, Avatar } from '@/components/ui';
import useStore from '@/lib/store';

export default function FriendRequestsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [processingIds, setProcessingIds] = useState([]);
  
  const router = useRouter();
  const { friendRequests, setFriendRequests, setFriends, friends } = useStore();
  
  // Accept friend request
  const handleAccept = async (request) => {
    if (processingIds.includes(request.friendshipId)) return;
    
    setProcessingIds(prev => [...prev, request.friendshipId]);
    
    try {
      const res = await fetch('/api/friends/respond', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          friendshipId: request.friendshipId,
          status: 'ACCEPTED',
        }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to accept request');
      }
      
      const data = await res.json();
      
      // Update friends and requests lists
      setFriendRequests(friendRequests.filter(r => r.friendshipId !== request.friendshipId));
      setFriends([...friends, { ...data }]);
    } catch (error) {
      console.error('Accept request error', error);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== request.friendshipId));
    }
  };
  
  // Reject friend request
  const handleReject = async (request) => {
    if (processingIds.includes(request.friendshipId)) return;
    
    setProcessingIds(prev => [...prev, request.friendshipId]);
    
    try {
      const res = await fetch('/api/friends/respond', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          friendshipId: request.friendshipId,
          status: 'REJECTED',
        }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to reject request');
      }
      
      // Update requests list
      setFriendRequests(friendRequests.filter(r => r.friendshipId !== request.friendshipId));
    } catch (error) {
      console.error('Reject request error', error);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== request.friendshipId));
    }
  };
  
  // Filter requests by type
  const receivedRequests = friendRequests.filter(r => !r.isRequester);
  const sentRequests = friendRequests.filter(r => r.isRequester);
  
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Friend Requests</h1>
      
      {/* Received requests */}
      <Card className="mb-6">
        <h2 className="font-bold mb-4">Pending Requests</h2>
        
        {receivedRequests.length === 0 ? (
          <p className="text-sm text-gray-500">No pending friend requests</p>
        ) : (
          <div className="space-y-4">
            {receivedRequests.map(request => (
              <div 
                key={request.id} 
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div className="flex items-center">
                  <Avatar name={request.name} />
                  <div className="ml-3">
                    <h3 className="font-medium">{request.name}</h3>
                    <p className="text-sm text-gray-500">{request.email}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handleReject(request)}
                    disabled={processingIds.includes(request.friendshipId)}
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleAccept(request)}
                    disabled={processingIds.includes(request.friendshipId)}
                  >
                    {processingIds.includes(request.friendshipId) ? (
                      <Spinner size="small" />
                    ) : (
                      'Accept'
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
      
      {/* Sent requests */}
      <Card>
        <h2 className="font-bold mb-4">Sent Requests</h2>
        
        {sentRequests.length === 0 ? (
          <p className="text-sm text-gray-500">You haven't sent any requests</p>
        ) : (
          <div className="space-y-4">
            {sentRequests.map(request => (
              <div 
                key={request.id} 
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div className="flex items-center">
                  <Avatar name={request.name} />
                  <div className="ml-3">
                    <h3 className="font-medium">{request.name}</h3>
                    <p className="text-sm text-gray-500">{request.email}</p>
                  </div>
                </div>
                
                <span className="text-sm text-gray-500">Pending</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
