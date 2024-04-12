import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const withAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Check if there is an active session, otherwise redirect to the login page
    useEffect(() => {
      if (status === 'unauthenticated') {
        router.push('/'); 
      }
    }, [status, router]);

    
    return session ? <WrappedComponent {...props} /> : null;
  };

  return Wrapper;
};

export default withAuth;