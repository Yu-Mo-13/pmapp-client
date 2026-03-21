import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorPageCard from '../ErrorPageCard';

jest.mock('next/link', () => {
  return function MockLink({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  };
});

describe('ErrorPageCard', () => {
  it('404/500 共通の導線を表示する', () => {
    render(
      <ErrorPageCard
        title="404 Not Found"
        message="指定したページが見つかりませんでした。"
        actionHref="/passwords"
        icon={<span data-testid="error-icon" />}
      />
    );

    expect(screen.getByText('404 Not Found')).toBeInTheDocument();
    expect(
      screen.getByText('指定したページが見つかりませんでした。')
    ).toBeInTheDocument();
    expect(screen.getByTestId('error-icon')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'トップページに戻る' })).toHaveAttribute(
      'href',
      '/passwords'
    );
  });
});
