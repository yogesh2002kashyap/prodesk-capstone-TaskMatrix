import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Eye, EyeOff } from 'lucide-react';
import api from '../services/api';


export default function AuthPage(){
  const navigate = useNavigate();
  const {login} = useAuth();

  const [tab, setTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form,setForm] = useState({
    name:'',
    email:'',
    password:'',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleTabSwitch =(newTab) => {
    setTab(newTab);
    setError('');
    setForm({name:'',email:'',password:''});
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

  if(tab === 'register' && form.password.length < 8){
    setError('Password must br atleat 8 characters');
    return;
  };
  
  setLoading(true);

  try{
    if(tab === 'register') {
      const res = await api.post('/api/register', {
        name:form.name,
        email:form.email,
        password:form.password,
      });
      localStorage.setItem('tm_token', res.data.token);
      localStorage.setItem('tm_user', JSON.stringify(res.data.user));
    }else {
      await login(form.email, form.password);
    }
    navigate('/board');
  }catch(err) {
    setError(err.response?.data?.message || 'Something went wrong');
  }finally{
    setLoading(false);
  }
 };

 return (
  <div className="min-h-screen flex items-center justify-center bg-brand-bg">
    <div className="w-full max-w-sm bg-white rounded-md shadow-sm p-8">
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center text-xs font-medium text-blue-800">
            TM
          </div>
          <span className="text-sm font-medium text-gray-900">TaskMatrix</span>
        </div>
      </div>

      <div className="flex bg-gray-50 rounded-md p-1 mb-6 border border-gray-100">
        <button type="button" onClick={()=> handleTabSwitch('login')}
          className={`flex-1 py-2 text-xs rounded transition ${
            tab === 'login'? 'bg-white text-gray-900 font-medium shadow-sm' :
            'text-gray-400 hover:text-gray-800'
          }`}>Sign In</button>
          <button type="button" onClick={() => handleTabSwitch('register')} 
            className={`flex-1 py-2 text-xs rounded transition ${
              tab === 'register' ? 'bg-white text-gray-900 font-medium shadow-sm':
              'text-gray-400 hover:text-gray-800'
            }`}>Create Account</button>
      </div>

      {error && (
        <div className="mb-4 px-3 py-2 bg-red-50 border border-red-400 rounded-md text-xs text-red-800">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="sapce-y-4">
        {tab === 'register' && (  
          <div>
            <label className="block text-xs text-gray-400 mb-1">
                Full name
              </label>
              <input type="text" name="name" required value={form.name}
              onChange={handleChange} placeholder="Yogesh Kashyap" 
              className="w-full border border-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
          </div>
        )} 
          <div>
             <label className="block text-xs text-gray-400 mb-1">
              Work email
            </label>
            <input type="email" name="email" required value={form.email} 
            onChange={handleChange} 
            className="w-full border border-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Password
            </label>
            <div className="relative">
              <input type={showPassword?'text':'password'} name="password" required 
              onChange={handleChange}
              placeholder={tab === 'register' ? 'Min. 8 characters' : '••••••••'}
              className="w-full border border-gray-100 rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              /> <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {tab === 'login' && (
            <div className="text-right">
              <button
                type="button"
                className="text-[11px] text-blue-800 hover:underline"
              >Forgot password?</button>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-brand-dark text-gray-50 text-sm font-medium rounded-md hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? tab === 'login' ? 'Signing in...' : 'Creating account...'
              : tab === 'login' ? 'Sign in' : 'Create account'
            }
          </button>
      </form>

      <p className="text-center text-xs text-gray-400 mt-5">
          {tab === 'login' ? (
            <>No account?{' '}
              <button
                type="button"
                onClick={() => handleTabSwitch('register')}
                className="text-blue-800 hover:underline"
              >
                Create one
              </button>
            </>
          ) : (
            <>Already have an account?{' '}
              <button
                type="button"
                onClick={() => handleTabSwitch('login')}
                className="text-blue-800 hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </p>
    </div>
  </div>
 );


};

