import { UserHeader, UserPost } from '../components';

const UserPage = () => {
  return (
    <>
      <UserHeader />
      <UserPost
        likes={1200}
        replies={479}
        postImg='/post1.png'
        postTitle='Lets talk about threads'
      />
      <UserPost
        likes={641}
        replies={252}
        postImg='/post2.png'
        postTitle='Great tutorial'
      />
      <UserPost
        likes={761}
        replies={331}
        postImg='/post3.png'
        postTitle='I love this guy'
      />
      <UserPost likes={214} replies={91} postTitle='This is my first thread' />
    </>
  );
};
export default UserPage;
