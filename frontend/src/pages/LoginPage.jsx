import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import Card from '../components/ui/Card';

const LoginPage = () => {
  return (
    <div className="max-w-md mx-auto py-8">
      <Card className="p-6">
        <LoginForm />
      </Card>
    </div>
  );
};

export default LoginPage;
