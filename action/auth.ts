'use server';

import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';
import { authApi } from '@/services';
import { TLoginPayload, TLoginResponse, TRegisterPayload } from '@/models/auth';
import { APP_CONFIG } from '@/common/config';


// Simple auth functions for a one-week project

// Login function
export async function actionLogin(phone: string, password: string) {
  try {
    // In a real app, you would call your auth API here
    const res = await authApi.login({ phone, password });

    if (!res.success) {
      return { success: false, error: res.message };
    }

    // Set auth cookie
    (await cookies()).set(APP_CONFIG.cookies.tokenKey, res.data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: res.data.expires_in || 60 * 60 * 24 * 7, // Use expires_in from API or fallback to 1 week
      path: '/',
    });

    // Set refresh token cookie if available
    if (res.data.refresh_token) {
      (await cookies()).set(APP_CONFIG.cookies.refreshTokenKey, res.data.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30, // Refresh token typically lasts longer (30 days)
        path: '/',
      });
    }

    // Revalidate user data
    revalidateTag('user', 'max');

    return { success: true, user: res.data };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Something went wrong' };
  }
}

// Register function
export async function actionRegister(full_name: string, phone: string, password: string, confirm_password: string, province: string) {
  try {
    // Validate passwords match
    if (password !== confirm_password) {
      return { success: false, error: 'Mật khẩu không khớp' };
    }

    // Call register API
    const res = await authApi.register({ full_name, phone, password, confirm_password, province });
  

    if (!res || !res.success) {
      return { success: false, error: res?.message || 'Đăng ký thất bại' };
    }

    // If register API doesn't return token, login automatically
    let token = res?.data?.access_token;
    let expires_in = res?.data?.expires_in;
    let loginRes = null;
    
    if (!token) {
      console.log('No token from register, attempting auto-login...');
      loginRes = await authApi.login({ phone, password });
      console.log('Auto-login response:', loginRes);
      
      if (loginRes.success && loginRes.data?.access_token) {
        token = loginRes.data.access_token;
        expires_in = loginRes.data.expires_in;
      }
    }

    if (!token) {
      return { success: false, error: 'Đăng ký thành công nhưng không thể lấy token' };
    }

    // Set auth cookie after successful registration
    (await cookies()).set(APP_CONFIG.cookies.tokenKey, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expires_in || 60 * 60 * 24 * 7, // Use expires_in from API or fallback to 1 week
      path: '/',
    });

    // Set refresh token cookie if available from register or login response
    const refreshToken = res?.data?.refresh_token || loginRes?.data?.refresh_token;
    if (refreshToken) {
      (await cookies()).set(APP_CONFIG.cookies.refreshTokenKey, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30, // Refresh token typically lasts longer (30 days)
        path: '/',
      });
    }

    // Revalidate user data
    revalidateTag('user', 'max');

    return { success: true, user: res.data };
  } catch (error) {
    console.error('Register error:', error);
    return { success: false, error: 'Đăng ký thất bại' };
  }
}

// Refresh token function
export async function actionRefreshToken() {
  try {
    // Get refresh token from cookies
    const refreshToken = (await cookies()).get(APP_CONFIG.cookies.refreshTokenKey);
    
    console.log('=== REFRESH TOKEN DEBUG ===');
    console.log('Refresh token from cookies:', refreshToken ? 'EXISTS' : 'NOT FOUND');
    
    if (!refreshToken) {
      console.log('❌ No refresh token found in cookies');
      return { success: false, error: 'No refresh token found' };
    }

    // Call refresh API with refresh token in body
    console.log('🔄 Calling refresh API...');
    const res = await authApi.refreshToken();
    
    console.log('Refresh API response:', res);
    
    if (!res || !res.success) {
      console.log('❌ Token refresh failed:', res?.message || 'Unknown error');
      return { success: false, error: res?.message || 'Token refresh failed' };
    }

    console.log('✅ Token refresh successful!');
    console.log('New access token:', res.data.access_token ? 'RECEIVED' : 'MISSING');
    console.log('New refresh token:', res.data.refresh_token ? 'RECEIVED' : 'NOT RETURNED');
    console.log('Expires in:', res.data.expires_in || 'NOT SPECIFIED');

    // Set new access token
    (await cookies()).set(APP_CONFIG.cookies.tokenKey, res.data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: res.data.expires_in || 60 * 60 * 24 * 7,
      path: '/',
    });

    console.log('✅ New access token saved to cookies');

    // Update refresh token if returned
    if (res.data.refresh_token) {
      (await cookies()).set(APP_CONFIG.cookies.refreshTokenKey, res.data.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });
      console.log('✅ New refresh token saved to cookies');
    } else {
      console.log('ℹ️ No new refresh token returned, keeping existing one');
    }

    // Revalidate user data
    revalidateTag('user', 'max');

    console.log('=== REFRESH TOKEN COMPLETE ===');
    return { success: true, data: res.data };
  } catch (error) {
    console.error('❌ Refresh token error:', error);
    return { success: false, error: 'Token refresh failed' };
  }
}

// Logout function
export async function actionLogout() {
  try {
    // Remove auth cookie
    (await cookies()).delete(APP_CONFIG.cookies.tokenKey);
    
    // Remove refresh token cookie
    (await cookies()).delete(APP_CONFIG.cookies.refreshTokenKey);
    
    // Revalidate user data
    revalidateTag('user', 'max');
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: 'Logout failed' };
  }
}

// Check auth status
export async function checkAuth() {
  const token = (await cookies()).get( APP_CONFIG.cookies.tokenKey);
  return { isAuthenticated: !!token };
}
/**
 * Remove token only (for specific cases)
 */
export async function actionRemoveToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get(APP_CONFIG.cookies.tokenKey);

  if (token) {
    cookieStore.delete(APP_CONFIG.cookies.tokenKey);
  }
}

/**
 * Check if user is authenticated
 */
export async function checkAuthAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(APP_CONFIG.cookies.tokenKey);

    return {
      isAuthenticated: !!token?.value,
      token: token?.value,
    };
  } catch (error) {
    return {
      isAuthenticated: false,
      token: undefined,
    };
  }
}
