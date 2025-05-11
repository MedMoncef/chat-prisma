import { prisma } from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth-helper';
import { apiError, apiResponse } from '@/lib/api-utils';

// Get all friends (accepted) and friend requests (pending)
export async function GET() {
  try {
    const userPayload = await getUserFromCookie();
    
    if (!userPayload || !userPayload.id) {
      return apiError('Unauthorized', 401);
    }
    
    const userId = userPayload.id as string;
    
    // Get the friendships where the user is either the requester or addressee
    const sentRequests = await prisma.friendship.findMany({
      where: {
        requesterId: userId
      },
      include: {
        addressee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    const receivedRequests = await prisma.friendship.findMany({
      where: {
        addresseeId: userId
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    // Process the friendship data to make it easier for the frontend
    const friends = [];
    const pendingRequests = [];
    const receivedPendingRequests = [];
    
    // Handle sent requests
    for (const request of sentRequests) {
      if (request.status === 'ACCEPTED') {
        friends.push({
          id: request.addressee.id,
          name: request.addressee.name,
          email: request.addressee.email,
          friendshipId: request.id
        });
      } else if (request.status === 'PENDING') {
        pendingRequests.push({
          id: request.addressee.id,
          name: request.addressee.name,
          email: request.addressee.email,
          friendshipId: request.id
        });
      }
    }
    
    // Handle received requests
    for (const request of receivedRequests) {
      if (request.status === 'ACCEPTED') {
        friends.push({
          id: request.requester.id,
          name: request.requester.name,
          email: request.requester.email,
          friendshipId: request.id
        });
      } else if (request.status === 'PENDING') {
        receivedPendingRequests.push({
          id: request.requester.id,
          name: request.requester.name,
          email: request.requester.email,
          friendshipId: request.id
        });
      }
    }
    
    return apiResponse({
      friends,
      pendingRequests,
      receivedPendingRequests
    });
  } catch (error) {
    console.error('Error getting friends:', error);
    return apiError('Failed to get friends', 500);
  }
}
