import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import * as styles from './Header.css';

import { PATH } from '@/route/path';
import IcLogo from '@/assets/svg/IcLogo';
import LoginModal from '@/common/component/LoginModal/LoginModal';
import { useOverlayModal } from '@/common/hook/useOverlayModal';
import { useGetUser } from '@/api/domain/signup/hook/useGetUser';
import UserModal from '@/common/component/UserModal/UserModal';
import { useAuthStore } from '@/store/useAuthStore';

const MENUS = [
  { label: '나의 할 일', path: PATH.TODO_MY },
  { label: '나의 만다라트', path: PATH.MANDAL },
  { label: '나의 히스토리', path: PATH.HISTORY },
];

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isSignUpPage = location.pathname === PATH.SIGNUP;

  const { data: userData, isLoading } = useGetUser();

  const { user, isLoggedIn, setUser, resetUser } = useAuthStore(
    useShallow((s) => ({
      user: s.user,
      isLoggedIn: s.isLoggedIn,
      setUser: s.setUser,
      resetUser: s.resetUser,
    })),
  );

  const findActiveMenu = MENUS.find((menu) => location.pathname.startsWith(menu.path));
  const initialMenu = findActiveMenu ? findActiveMenu.label : '';

  const [activeMenu, setActiveMenu] = useState<string>(initialMenu);
  const [openProfile, setOpenProfile] = useState<boolean>(false);

  const { openModal, closeModal } = useOverlayModal();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (userData) {
      setUser(userData);
    } else {
      resetUser();
    }
  }, [isLoading, userData, setUser, resetUser]);

  const handleLogin = () => {
    openModal(<LoginModal onClose={closeModal} />);
  };

  const handleMenuClick = (menuLabel: string, path: string) => {
    setActiveMenu(menuLabel);
    navigate(path);
  };

  const handleProfile = () => {
    setOpenProfile((prev) => !prev);
  };

  const renderNavMenu = () => (
    <>
      <nav className={styles.navWrapper} aria-label="주요 메뉴">
        {MENUS.map((menu) => {
          const isActive = activeMenu === menu.label;
          const buttonClass = `${styles.navItem} ${isActive ? styles.navItemActive : ''}`;

          return (
            <button
              key={menu.label}
              className={buttonClass}
              onClick={() => handleMenuClick(menu.label, menu.path)}
              aria-current={isActive ? 'page' : undefined}
            >
              {menu.label}
            </button>
          );
        })}
      </nav>
      <button onClick={handleProfile}>
        {user.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt="유저 프로필 이미지"
            className={styles.profilePlaceholder}
            onMouseDown={(e) => e.stopPropagation()}
          />
        ) : null}
      </button>
      {openProfile && <UserModal onClose={() => setOpenProfile(false)} />}
    </>
  );

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link to={PATH.ROOT}>
          <IcLogo className={styles.logoImage} />
        </Link>

        {isLoggedIn
          ? renderNavMenu()
          : !isSignUpPage && (
              <button className={styles.loginButton} onClick={handleLogin} type="button">
                로그인
              </button>
            )}
      </div>
    </header>
  );
};
export default Header;
