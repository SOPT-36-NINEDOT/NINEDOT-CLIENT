import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useGoogleAuth } from '@/common/hook/useGoogleAuth';
import { PATH } from '@/route';
import { useAuthStore } from '@/store/useAuthStore';

const GoogleCallback = () => {
  const userData = useGoogleAuth();
  const navigate = useNavigate();

  const { updateLoginStatus } = useAuthStore();

  useEffect(() => {
    if (!userData) {
      return;
    }

    updateLoginStatus();

    const { exists, onboardingPage } = userData;

    if (!exists) {
      navigate(PATH.SIGNUP, {
        state: { userData },
      });
      return;
    }

    if (onboardingPage === 'ONBOARDING_COMPLETED') {
      navigate(PATH.MANDAL);
    } else {
      navigate(PATH.INTRO, { state: { pageState: onboardingPage } });
    }
  }, [userData, navigate]);

  return null;
};

export default GoogleCallback;
