import { auth } from '@clerk/nextjs';

const ServerTest = () => {
  const session = auth();
  console.log('session -->', session);
  return <p>I was rendered by the server</p>;
};

export default ServerTest;
