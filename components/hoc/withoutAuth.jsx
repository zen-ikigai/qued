import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const withoutAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Check if there is an active session, otherwise redirect to the login page
    useEffect(() => {
      if (status === 'authenticated') {
        router.push('/dashboard'); 
      }
    }, [status, router]);

    
    return session ? null : <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withoutAuth;
