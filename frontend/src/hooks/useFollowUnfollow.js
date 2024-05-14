import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import useShowToast from './useShowToast';
import userAtom from '../atoms/userAtom';

const useFollowUnfollow = (user) => {
  const currentUser = useRecoilValue(userAtom);
  const [following, setFollowing] = useState(
    user.followers.some((follower) => follower.userId === currentUser?._id)
  );

  const [updating, setUpdating] = useState(false);
  const showToast = useShowToast();

  const handleFollowUnfollow = async () => {
    if (!currentUser) {
      showToast(
        'An error has occured',
        'Please login to follow users',
        'error'
      );
      return;
    }
    if (updating) return;

    setUpdating(true);

    try {
      const res = await fetch(`/api/users/follow/${user._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (data.error) {
        showToast('An error has occured', data.error, 'error');
        return;
      }

      if (following) {
        showToast('Success', `Unfollowed ${user.name}`, 'success');
        user.followers.pop();
      } else {
        showToast('Success', `Followed ${user.name}`, 'success');
        user.followers.push(currentUser?._id);
      }

      setFollowing(!following);

      console.log(data);
    } catch (error) {
      showToast('An error has occured', error, 'error');
    } finally {
      setUpdating(false);
    }
  };
  return { handleFollowUnfollow, updating, following };
};

export default useFollowUnfollow;
