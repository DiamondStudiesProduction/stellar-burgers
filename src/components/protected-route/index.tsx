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
  const { user, userCheck } = useSelector((store: RootState) => store.user);
  const location = useLocation();
  if (!userCheck) {
    return <Preloader />;
  }
  if (user && onlyUnAuth) {
    return (
      <Navigate replace to={location.state?.from ? location.state.from : '/'} />
    );
  }
  if (!user && !onlyUnAuth) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
