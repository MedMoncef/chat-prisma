import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

// Get messages between current user and another user
export async function GET(
  request: NextRequest,
  { params }: { params: { friendId: string } }
) {
  try {
    const userPayload = await getUserFromCookie();
    
    if (!userPayload || !userPayload.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = userPayload.id as string;
    const friendId = params.friendId;
    
    // Check if there's a friendship between users
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: userId, addresseeId: friendId, status: 'ACCEPTED' },
          { requesterId: friendId, addresseeId: userId, status: 'ACCEPTED' }
        ]
      }
    });
    
    if (!friendship) {
      return NextResponse.json({ error: 'Not friends with this user' }, { status: 403 });
    }
    
    // Get messages between users
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: friendId },
          { senderId: friendId, receiverId: userId }
        ]
      },
      orderBy: { createdAt: 'asc' }
    });
    
    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json({ error: 'Failed to get messages' }, { status: 500 });
  }
}

// Send a message to a friend
export async function POST(
  request: NextRequest,
  { params }: { params: { friendId: string } }
) {
  try {
    const userPayload = await getUserFromCookie();
    
    if (!userPayload || !userPayload.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = userPayload.id as string;
    const friendId = params.friendId;
    
    const { content } = await request.json();
    
    if (!content) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }
    
    // Check if there's a friendship between users
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: userId, addresseeId: friendId, status: 'ACCEPTED' },
          { requesterId: friendId, addresseeId: userId, status: 'ACCEPTED' }
        ]
      }
    });
    
    if (!friendship) {
      return NextResponse.json({ error: 'Not friends with this user' }, { status: 403 });
    }
    
    // Send message
    const message = await prisma.message.create({
      data: {
        content,
        senderId: userId,
        receiverId: friendId
      }
    });
    
    return NextResponse.json(message);
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
