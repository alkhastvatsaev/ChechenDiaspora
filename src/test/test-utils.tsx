import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Providers } from '../contexts/Providers';
import { vi } from 'vitest';

// Need to mock Next.js router since it's used inside the app
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
}));

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Providers>
      {children}
    </Providers>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
