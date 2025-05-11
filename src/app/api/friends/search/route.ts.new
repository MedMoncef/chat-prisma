import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth-helper';
import { apiError, apiResponse } from '@/lib/api-utils';

// Search users by email to add as friends
export async function GET(request: NextRequest) {
  try {
    const userPayload = await getUserFromCookie();
    
    if (!userPayload || !userPayload.id) {
      return apiError('Unauthorized', 401);
    }
    
    const userId = userPayload.id as string;
    const searchQuery = request.nextUrl.searchParams.get('query') || '';
    
    if (!searchQuery) {
      return apiResponse({ users: [] });
    }
    
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { email: { contains: searchQuery } },
              { name: { contains: searchQuery } }
            ]
          },
          { id: { not: userId } } // Don't include the current user
        ]
      },
      select: {
        id: true,
        name: true,
        email: true
      },
      take: 10 // Limit results
    });
    
    // Get all friendships for the current user to check status
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: userId },
          { addresseeId: userId }
        ]
      }
    });
    
    const results = users.map(user => {
      // Check if there is a friendship with this user
      const friendship = friendships.find(f => 
        (f.requesterId === userId && f.addresseeId === user.id) || 
        (f.addresseeId === userId && f.requesterId === user.id)
      );
      
      let friendshipStatus = null;
      let friendshipId = null;
      let isRequester = false;
      
      if (friendship) {
        friendshipStatus = friendship.status;
        friendshipId = friendship.id;
        isRequester = friendship.requesterId === userId;
      }
      
      return {
        ...user,
        friendshipStatus,
        friendshipId,
        isRequester
      };
    });
    
    return apiResponse({ users: results });
  } catch (error) {
    console.error('Error searching users:', error);
    return apiError('Failed to search users', 500);
  }
}
