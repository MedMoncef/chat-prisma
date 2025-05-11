import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePasswords } from '@/lib/auth-helper';
import { apiError, apiResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return apiError('Email and password are required', 400);
    }
      const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return apiError('User not found', 404);
    }
    
    const passwordMatch = await comparePasswords(password, user.password);
    
    if (!passwordMatch) {
      return apiError('Invalid credentials', 401);
    }
    
    // Import inside function to avoid circular dependency
    const { setUserCookie } = await import('@/lib/auth-helper');
    await setUserCookie(user);
    
    return apiResponse({
      id: user.id,
      name: user.name,
      email: user.email
    });  } catch (error) {
    console.error('Login error:', error);
    return apiError('Authentication failed', 500);
  }
}
