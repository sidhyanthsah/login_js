'use client';

import { useState } from 'react';
import { AuthTabs } from '@/components/auth/auth-tabs';
import { LoginForm } from '@/components/auth/login-form';
import { SignupForm } from '@/components/auth/signup-form';
import { VerifyForm } from '@/components/auth/verify-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { AuthMode } from '@/types/auth';

export function AuthShowcase() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [emailForVerification, setEmailForVerification] = useState<string>('');
  const [verificationStep, setVerificationStep] = useState<'2fa-setup' | '2fa-verify'>('2fa-verify');
  const [setupSecret, setSetupSecret] = useState<string>('');

  const handleVerificationStart = (email: string, mode: 'setup' | 'verify') => {
    setEmailForVerification(email);
    setVerificationStep(mode === 'setup' ? '2fa-setup' : '2fa-verify');
    setAuthMode('verify');
  };

  const handleSetupSecret = (secret: string) => {
    setSetupSecret(secret);
  };

  const handleBackToLogin = () => {
    setAuthMode('login');
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <Card className="border-none shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">
            {authMode === 'login' && 'Welcome back'}
            {authMode === 'signup' && 'Create an account'}
            {authMode === 'verify' && 'Verification required'}
          </CardTitle>
          <CardDescription>
            {authMode === 'login' && 'Enter your credentials to sign in to your account'}
            {authMode === 'signup' && 'Fill in your details to create a new account'}
            {authMode === 'verify' && verificationStep === '2fa-setup'
              ? 'Set up two-factor authentication'
              : 'Enter your verification code'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {authMode === 'verify' ? (
            <VerifyForm
              email={emailForVerification}
              mode={verificationStep}
              setupSecret={setupSecret}
              onBack={handleBackToLogin}
            />
          ) : (
            <Tabs defaultValue="login" value={authMode}>
              <AuthTabs current={authMode} onChange={setAuthMode} />
              
              <TabsContent value="login" className="mt-0">
                <LoginForm onVerificationRequired={handleVerificationStart} />
              </TabsContent>
              
              <TabsContent value="signup" className="mt-0">
                <SignupForm 
                  onVerificationRequired={handleVerificationStart} 
                  onSetupSecret={handleSetupSecret}
                />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}