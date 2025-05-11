import { prisma } from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth-helper';
import { apiError, apiResponse } from '@/lib/api-utils';

export async function GET() {
  try {
    const userPayload = await getUserFromCookie();
    
    if (!userPayload || !userPayload.id) {
      return apiError('Unauthorized', 401);
    }
    
    const userId = userPayload.id as string;
    
    // Get the active user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true
      }
    });
    
    if (!user) {
      return apiError('User not found', 404);
    }
    
    return apiResponse(user);
  } catch (error) {
    console.error('User session error:', error);
    return apiError('Failed to get user session', 500);
  }
}
