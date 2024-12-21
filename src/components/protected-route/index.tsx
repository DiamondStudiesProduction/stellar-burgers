import { Preloader } from '@ui';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from 'src/services/store';

const ProtectedRoute = ({
  children,
  onlyUnAuth
}: {
  children: React.ReactElement;
  onlyUnAuth?: boolean;
}) => {
  const { user, isLoading } = useSelector((store: RootState) => store.user);
  const location = useLocation();

  if (isLoading.isAuthLoading) {
    return <Preloader />;
  }

  if (!user && !onlyUnAuth) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }
  if (user && onlyUnAuth) {
    return <Navigate replace to='/' />;
  }

  return children;
};

export default ProtectedRoute;
