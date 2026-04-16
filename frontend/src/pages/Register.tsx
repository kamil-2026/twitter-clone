import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { getErrorMessage } from '@/lib/error-map';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Form } from '@/components/Form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Register() {
  const [formData, setFormData] = useState({ email: '', username: '', name: '', password: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: '' });
    }
  };

  const handleRegister = async () => {
    try {
      setFormErrors({});
      const { data } = await api.post('/auth/register', formData);
      login(data.token);
      toast.success('Registration successful');
      navigate('/');
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const mappedErrors = error.response.data.errors.reduce((acc: any, err: any) => {
          acc[err.path] = err.message;
          return acc;
        }, {});
        setFormErrors(mappedErrors);
        toast.error('Registration failed');
      } else {
        toast.error(getErrorMessage(error, 'Registration failed'));
      }
    }
  };

  return (
    <Form
      header={
        <h2 className="text-center text-3xl font-extrabold tracking-tight">Create your account</h2>
      }
      footer={
        <p className="text-center text-sm text-gray-500">
          Have an account already?{' '}
          <Link to="/login" className="text-[#1DA1F2] hover:underline">
            Log in
          </Link>
        </p>
      }
    >
      <div className="space-y-4">
        <div>
          <Input name="name" placeholder="Name" onChange={handleChange} />
          {formErrors.name && <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>}
        </div>
        <div>
          <Input name="email" type="email" placeholder="Email" onChange={handleChange} />
          {formErrors.email && <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>}
        </div>
        <div>
          <Input name="username" placeholder="Username" onChange={handleChange} />
          {formErrors.username && (
            <p className="mt-1 text-xs text-red-500">{formErrors.username}</p>
          )}
        </div>
        <div>
          <Input name="password" type="password" placeholder="Password" onChange={handleChange} />
          {formErrors.password && (
            <p className="mt-1 text-xs text-red-500">{formErrors.password}</p>
          )}
        </div>
      </div>
      <Button onClick={handleRegister}>Next</Button>
    </Form>
  );
}
