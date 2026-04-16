import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { getErrorMessage } from '@/lib/error-map';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Form } from '@/components/Form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Login() {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: '' });
    }
  };

  const handleLogin = async () => {
    try {
      setFormErrors({});
      const { data } = await api.post('/auth/login', formData);
      login(data.token);
      toast.success('Logged in successfully');
      navigate('/');
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const mappedErrors = error.response.data.errors.reduce((acc: any, err: any) => {
          acc[err.path] = err.message;
          return acc;
        }, {});
        setFormErrors(mappedErrors);
        toast.error('Login failed');
      } else {
        toast.error(getErrorMessage(error, 'Login failed'));
      }
    }
  };

  return (
    <Form
      header={
        <h2 className="text-center text-3xl font-extrabold tracking-tight">Sign in to Twitter</h2>
      }
      footer={
        <p className="text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#1DA1F2] hover:underline">
            Sign up
          </Link>
        </p>
      }
    >
      <div className="space-y-4">
        <div>
          <Input name="identifier" placeholder="Email or username" onChange={handleChange} />
          {formErrors.identifier && (
            <p className="mt-1 text-xs text-red-500">{formErrors.identifier}</p>
          )}
        </div>
        <div>
          <Input name="password" type="password" placeholder="Password" onChange={handleChange} />
          {formErrors.password && (
            <p className="mt-1 text-xs text-red-500">{formErrors.password}</p>
          )}
        </div>
      </div>
      <Button onClick={handleLogin}>Log in</Button>
    </Form>
  );
}
