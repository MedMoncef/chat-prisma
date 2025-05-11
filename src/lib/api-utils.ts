import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserFromCookie, verifyToken } from '@/lib/auth-helper';

// A middleware function to use in API routes to check authentication
export async function authenticateRequest() {
  try {
    const cookiesList = await cookies();
    const token = cookiesList.get('auth-token')?.value;
    
    if (!token) {
      return {
        authenticated: false,
        error: 'Authentication required',
        status: 401,
        user: null
      };
    }
    
    const payload = await verifyToken(token);
    
    if (!payload || !payload.id) {
      return {
        authenticated: false,
        error: 'Invalid token',
        status: 401,
        user: null
      };
    }
    
    return {
      authenticated: true,
      error: null,
      status: 200,
      user: payload
    };
  } catch (error) {
    return {
      authenticated: false,
      error: 'Authentication failed',
      status: 500,
      user: null
    };
  }
}

// Create a standardized API response
export function apiResponse(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

// Create an error response
export function apiError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}
