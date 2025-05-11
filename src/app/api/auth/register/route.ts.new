import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth-helper';
import { apiError, apiResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();
    
    if (!name || !email || !password) {
      return apiError('Name, email and password are required', 400);
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return apiError('User with this email already exists', 409);
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });
    
    // Import inside function to avoid circular dependency
    const { setUserCookie } = await import('@/lib/auth-helper');
    await setUserCookie(user);
    
    return apiResponse({
      id: user.id,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    console.error('Registration error:', error);
    return apiError('Registration failed', 500);
  }
}
