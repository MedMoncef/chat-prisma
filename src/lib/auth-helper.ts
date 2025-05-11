// This is a new auth helper that uses the correct cookie handling for Next.js 15
import { compare, hash } from 'bcrypt';
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default_secret_please_change_in_production'
);

export async function hashPassword(password: string) {
  return hash(password, 10);
}

export async function comparePasswords(plainPassword: string, hashedPassword: string) {
  return compare(plainPassword, hashedPassword);
}

export async function createToken(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {});
    return payload;
  } catch (error) {
    return null;
  }
}

// For Next.js 15 Edge Runtime
// See: https://nextjs.org/docs/app/api-reference/functions/cookies
export async function getUserFromCookie() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) return null;
    return verifyToken(token);
  } catch (error) {
    console.error('Error parsing cookies:', error);
    return null;
  }
}

// Use cookies() API for cookie operations - now as async function in Next.js 15
export async function setUserCookie(user: any) {
  const token = await createToken({
    id: user.id,
    email: user.email,
    name: user.name,
  });
  
  const cookieStore = await cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });
  
  return token;
}

export async function removeUserCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
}
