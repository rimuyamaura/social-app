import { useRecoilValue, useSetRecoilState } from 'recoil';
import { SignupCard, LoginCard } from '../components';
import authScreenAtom from '../atoms/authAtom';

const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom);
  console.log(authScreenState);
  return <>{authScreenState === 'login' ? <LoginCard /> : <SignupCard />}</>;
};
export default AuthPage;
