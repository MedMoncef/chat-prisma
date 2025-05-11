import { removeUserCookie } from '@/lib/auth-helper';
import { apiError, apiResponse } from '@/lib/api-utils';

export async function POST() {
  try {
    await removeUserCookie();
    return apiResponse({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return apiError('Logout failed', 500);
  }
}
