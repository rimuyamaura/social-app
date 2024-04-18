import { useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import useShowToast from './useShowToast';

const useLogout = () => {
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast;

  const logout = async () => {
    try {
      const res = await fetch('/api/users/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();

      if (data.error) {
        showToast('An error occurred.', data.error, 'error');
      }

      localStorage.removeItem('user-threads');
      setUser(null);
    } catch (error) {
      showToast('An error occurred.', error, 'error');
    }
  };
  return logout;
};
export default useLogout;
