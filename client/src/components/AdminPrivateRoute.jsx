import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function AdminPrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);

  if (currentUser && !currentUser.isAdmin) return <Navigate to="/" />;

  return currentUser && currentUser.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" />
  );
}
