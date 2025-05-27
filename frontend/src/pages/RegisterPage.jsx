import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import Card from '../components/ui/Card';

const RegisterPage = () => {
  return (
    <div className="max-w-md mx-auto py-8">
      <Card className="p-6">
        <RegisterForm />
      </Card>
    </div>
  );
};

export default RegisterPage;
