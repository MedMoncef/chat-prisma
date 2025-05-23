import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth-helper';
import { apiError, apiResponse } from '@/lib/api-utils';

// Accept/reject a friend request
export async function PUT(request: NextRequest) {
  try {
    const userPayload = await getUserFromCookie();
    
    if (!userPayload || !userPayload.id) {
      return apiError('Unauthorized', 401);
    }
    
    const { friendshipId, status } = await request.json();
    
    if (!friendshipId || !status) {
      return apiError('Friendship ID and status are required', 400);
    }
    
    if (status !== 'ACCEPTED' && status !== 'REJECTED') {
      return apiError('Invalid status', 400);
    }
    
    const userId = userPayload.id as string;
    
    // Check if this user is the addressee of the friend request
    const friendship = await prisma.friendship.findFirst({
      where: {
        id: friendshipId,
        addresseeId: userId,
        status: 'PENDING'
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
    
    if (!friendship) {
      return apiError('Friend request not found or you are not the recipient of this request', 404);
    }
    
    // Update friendship status
    const updatedFriendship = await prisma.friendship.update({
      where: {
        id: friendshipId
      },
      data: {
        status
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
    
    // Create empty conversation if accepted
    if (status === 'ACCEPTED') {
      // Check if a conversation already exists between these users
      const existingConversation = await prisma.conversation.findFirst({
        where: {
          OR: [
            {
              user1Id: userId,
              user2Id: friendship.requester.id
            },
            {
              user1Id: friendship.requester.id,
              user2Id: userId
            }
          ]
        }
      });
      
      if (!existingConversation) {
        await prisma.conversation.create({
          data: {
            user1Id: userId,
            user2Id: friendship.requester.id
          }
        });
      }
    }
    
    return apiResponse({
      id: updatedFriendship.requester.id,
      name: updatedFriendship.requester.name,
      email: updatedFriendship.requester.email,
      friendshipId: updatedFriendship.id,
      status: updatedFriendship.status
    });
  } catch (error) {
    console.error('Error responding to friend request:', error);
    return apiError('Failed to respond to friend request', 500);
  }
}