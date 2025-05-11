'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '@/lib/store';

export default function ChatIndexPage() {
  const router = useRouter();
  const { friends, selectedFriend } = useStore();
  
  useEffect(() => {
    // If we already have a selected friend, navigate to their chat
    if (selectedFriend) {
      router.push(`/chat/${selectedFriend.id}`);
      return;
    }
    
    // If we have friends but no selected friend, navigate to the first friend
    if (friends.length > 0) {
      router.push(`/chat/${friends[0].id}`);
      return;
    }
  }, [friends, selectedFriend, router]);
  
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-100">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-700">Welcome to Chat App</h2>
        <p className="mt-2 text-gray-500">
          {friends.length === 0
            ? 'Start by adding some friends!'
            : 'Select a conversation from the sidebar'}
        </p>
      </div>
    </div>
  );
}
