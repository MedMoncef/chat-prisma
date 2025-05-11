'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Card, Spinner } from '@/components/ui';
import useStore from '@/lib/store';
import { useForm } from '@/lib/useForm';
import { authService } from '@/lib/api-service';

export default function RegisterPage() {
  const [error, setError] = useState('');
  const {
    formValues,
    handleChange,
    isSubmitting,
    setIsSubmitting,
    validate
  } = useForm({
    name: '',
    email: '',
    password: ''
  });
  
  const router = useRouter();
  const login = useStore(state => state.login);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    const isValid = validate({
      name: {
        required: true,
        label: 'Name'
      },
      email: {
        required: true,
        label: 'Email',
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
      },
      password: {
        required: true, 
        label: 'Password',
        validate: (value) => value.length >= 6,
        message: 'Password must be at least 6 characters long'
      }
    });
    
    if (!isValid) return;
    
    setIsSubmitting(true);
    
    try {
      const userData = await authService.register(
        formValues.name,
        formValues.email,
        formValues.password
      );
      
      login(userData);
      router.push('/chat');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">Create Account</h2>
          <p className="mt-2 text-gray-600">Sign up to start chatting with friends</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>          <Input
            name="name"
            label="Full Name"
            value={formValues.name}
            onChange={handleChange}
            required
          />
          
          <Input
            name="email"
            label="Email Address"
            type="email"
            value={formValues.email}
            onChange={handleChange}
            required
          />
          
          <Input
            name="password"
            label="Password"
            type="password"
            value={formValues.password}
            onChange={handleChange}
            required
          />
          
          <Button
            type="submit"
            fullWidth
            disabled={isSubmitting}
            className="mt-4"
          >
            {isSubmitting ? <Spinner size="small" /> : 'Sign Up'}
          </Button>
        </form>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
