import { useDispatch } from 'react-redux';
import { logoutSuccess } from '../authActions';

const Logout = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Dispatch logout action
    dispatch(logoutSuccess());
    // Redirect or handle navigation here
  };

  return (
    <div>
      <p>Are you sure you want to logout?</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;