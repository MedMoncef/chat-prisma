import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth-helper';
import { apiError, apiResponse } from '@/lib/api-utils';

// Send friend request
export async function POST(request: NextRequest) {
  try {
    const userPayload = await getUserFromCookie();
    
    if (!userPayload || !userPayload.id) {
      return apiError('Unauthorized', 401);
    }
    
    const { addresseeId } = await request.json();
    
    if (!addresseeId) {
      return apiError('User ID is required', 400);
    }
    
    const userId = userPayload.id as string;
    
    // Check if addressee exists
    const addressee = await prisma.user.findUnique({
      where: { id: addresseeId }
    });
    
    if (!addressee) {
      return apiError('User not found', 404);
    }
    
    // Check if there's already a friendship
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          {
            requesterId: userId,
            addresseeId: addresseeId
          },
          {
            requesterId: addresseeId,
            addresseeId: userId
          }
        ]
      }
    });
    
    if (existingFriendship) {
      let statusMessage = '';
      
      if (existingFriendship.status === 'ACCEPTED') {
        statusMessage = 'You are already friends with this user';
      } else if (existingFriendship.status === 'PENDING') {
        if (existingFriendship.requesterId === userId) {
          statusMessage = 'You have already sent a friend request to this user';
        } else {
          statusMessage = 'This user has already sent you a friend request';
        }
      } else if (existingFriendship.status === 'REJECTED') {
        statusMessage = 'This user has rejected your friend request';
      }
      
      return apiError(statusMessage, 400);
    }
    
    // Create friendship request
    const friendship = await prisma.friendship.create({
      data: {
        requesterId: userId,
        addresseeId: addresseeId,
        status: 'PENDING'
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
    
    return apiResponse({
      id: friendship.addressee.id,
      name: friendship.addressee.name,
      email: friendship.addressee.email,
      friendshipId: friendship.id,
      status: friendship.status
    });
  } catch (error) {
    console.error('Error sending friend request:', error);
    return apiError('Failed to send friend request', 500);
  }
}
