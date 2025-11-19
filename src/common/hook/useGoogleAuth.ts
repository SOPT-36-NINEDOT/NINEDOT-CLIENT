import { useEffect, useState } from 'react';

import getGoogleAuthCode from '@/api/auth/googleLogin/util/getGoogleAuthCode';
import getAccessToken from '@/api/auth/googleLogin/util/getAccessToken';
import { useAuthStore } from '@/store/useAuthStore';

interface UserData {
  exists: boolean;
  userId?: number;
  accessToken?: string;
  onboardingPage: string;
}

export const useGoogleAuth = (): UserData | null => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const getToken = async () => {
      const code = getGoogleAuthCode();
      if (!code) {
        return;
      }

      try {
        const data = await getAccessToken(code);
        if (data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
          useAuthStore.getState().updateLoginStatus();
        }
        setUserData(data);
      } catch (error) {
        console.error('로그인 실패:', error);
      }
    };

    getToken();
  }, []);

  return userData;
};
