import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup } from '../ui/radio-group';
import { Button } from '../ui/button';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '@/redux/authSlice';
import { Loader2 } from 'lucide-react';
import { store } from '@/redux/store';



const Login = () => {
  const [input, setInput] = useState({
    email: '',
    password: '',
    role: '',
  });

  const { loading } = useSelector(store => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect');

 useEffect(() => {
  dispatch(setLoading(false));
}, [dispatch]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));

      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: {
          'Content-type': 'application/json'
        },
        withCredentials: true,
      });

      console.log("login API response: ", res);

     if (res.data.success) {
  const userData = res.data.user;

  // 🧼 Ensure consistent structure for Redux
  const cleanedUser = {
    _id: userData._id,
    fullname: userData.fullname,
    role: userData.role,
    profile: {
      profilePhoto: userData.profile?.profilePhoto || null,
    },
  };

  dispatch(setUser(cleanedUser));
console.log("User in Redux right after login:", store.getState().auth.user);


  localStorage.setItem('user', JSON.stringify(cleanedUser));
  toast.success(res.data.message);
  
  // Redirect to the path specified in query params, or home if none
  if (redirectPath) {
    navigate(redirectPath);
  } else {
    navigate('/');
  }
}


    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <div className="flex-grow flex items-center justify-center px-4">
          <form
            onSubmit={submitHandler}
            className="w-full max-w-md border border-gray-300 rounded-md p-4 max-h-[90vh] overflow-auto bg-gray-100"
          >
            <h1 className="font-bold text-xl mb-5">Login</h1>

            <div className="my-2">
              <Label>Email</Label>
              <Input
                autoFocus
                type="email"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                placeholder="e.g. chandlerbing@gmail.com"
              />
            </div>

            <div className="my-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={input.password}
                name="password"
                onChange={changeEventHandler}
              />
            </div>

            <div className="flex items-center justify-between">
              <RadioGroup className="flex items-center gap-4 my-5">
                <div className="flex items-center space-x-2">
                  <Input
                    id="r1"
                    type="radio"
                    name="role"
                    value="student"
                    className="cursor-pointer"
                    checked={input.role === 'student'}
                    onChange={changeEventHandler}
                  />
                  <Label htmlFor="r1">Student</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Input
                    id="r2"
                    type="radio"
                    name="role"
                    value="recruiter"
                    className="cursor-pointer"
                    checked={input.role === 'recruiter'}
                    onChange={changeEventHandler}
                  />
                  <Label htmlFor="r2">Recruiter</Label>
                </div>
              </RadioGroup>
            </div>

            {loading ? (
              <Button className="w-full my-4" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" className="w-full my-4 bg-[#217272]">
                Log in
              </Button>
            )}

            <span className="text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#217272] hover:text-[#102e2e]">
                Signup
              </Link>
            </span>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;