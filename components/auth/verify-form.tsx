'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { verifySchema } from '@/lib/validations/auth';
import { simulateVerifyRequest } from '@/lib/auth';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { QRCode } from '@/components/auth/qr-code';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';

interface VerifyFormProps {
  email: string;
  mode: '2fa-setup' | '2fa-verify';
  setupSecret: string;
  onBack: () => void;
}

export function VerifyForm({ email, mode, setupSecret, onBack }: VerifyFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const form = useForm({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: '',
    },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const restartCountdown = () => {
    setCountdown(30);
  };

  async function onSubmit(data: { code: string }) {
    setIsLoading(true);
    try {
      await simulateVerifyRequest({
        email,
        code: data.code,
        mode,
      });
      
      toast({
        title: mode === '2fa-setup' ? '2FA Setup Complete!' : 'Verification Successful!',
        description: mode === '2fa-setup' 
          ? 'Your account is now secured with two-factor authentication.' 
          : 'You have successfully logged in.',
      });
      
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (error) {
      toast({
        title: 'Verification Failed',
        description: error instanceof Error ? error.message : 'Invalid verification code',
        variant: 'destructive',
      });
      form.reset();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mb-2 -ml-3 text-muted-foreground"
          onClick={onBack}
          disabled={isLoading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Button>
        
        {mode === '2fa-setup' && (
          <div className="space-y-4">
            <FormDescription>
              Scan this QR code with your Google Authenticator app to set up two-factor authentication.
            </FormDescription>
            
            <div className="flex justify-center py-4">
              <QRCode
                value={`otpauth://totp/SecureApp:${email}?secret=${setupSecret}&issuer=SecureApp`}
                size={200}
              />
            </div>
            
            <FormDescription className="text-sm mt-2">
              Or enter this code manually in your app:
              <div className="mt-1 p-2 bg-muted rounded-md font-mono text-center select-all break-all">
                {setupSecret}
              </div>
            </FormDescription>
          </div>
        )}
        
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{mode === '2fa-setup' ? 'Verification Code' : 'Authentication Code'}</FormLabel>
              <FormDescription>
                {mode === '2fa-setup' 
                  ? 'Enter the 6-digit code from your authenticator app to verify setup.'
                  : 'Enter the 6-digit code from your authenticator app.'}
              </FormDescription>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  render={({ slots }) => (
                    <InputOTPGroup>
                      {Array.from({ length: 6 }).map((_, index) => (
                        <InputOTPSlot key={index} />
                      ))}
                    </InputOTPGroup>
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={restartCountdown}
            disabled={countdown > 0 || isLoading}
            className="text-xs"
          >
            {countdown > 0
              ? `New code in ${countdown}s`
              : 'Get new code'}
          </Button>
          
          <Button type="submit" disabled={isLoading || form.watch('code').length < 6}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === '2fa-setup' ? 'Complete Setup' : 'Verify'}
          </Button>
        </div>
      </form>
    </Form>
  );
}