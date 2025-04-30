'use client';

import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthMode } from '@/types/auth';

interface AuthTabsProps {
  current: AuthMode;
  onChange: (value: AuthMode) => void;
}

export function AuthTabs({ current, onChange }: AuthTabsProps) {
  return (
    <TabsList className="grid w-full grid-cols-2 mb-6">
      <TabsTrigger
        value="login"
        onClick={() => onChange('login')}
        className={current === 'login' ? 'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground' : ''}
      >
        Login
      </TabsTrigger>
      <TabsTrigger
        value="signup"
        onClick={() => onChange('signup')}
        className={current === 'signup' ? 'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground' : ''}
      >
        Sign up
      </TabsTrigger>
    </TabsList>
  );
}