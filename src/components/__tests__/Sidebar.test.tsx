import type { ReactNode } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import Sidebar from '../Sidebar';
import { MenuService } from '@/api/services/menu/menuService';

jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
    ...props
  }: {
    children: ReactNode;
    href: string;
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/passwords'),
}));

jest.mock('@/api/services/menu/menuService', () => ({
  MenuService: {
    index: jest.fn(),
  },
  extractMenuItems: jest.fn((value: { data?: { name: string; path: string }[] }) =>
    value.data ?? []
  ),
}));

describe('Sidebar', () => {
  beforeEach(() => {
    (MenuService.index as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        data: [
          { name: 'パスワード検索', path: '/passwords' },
          { name: '仮登録パスワード一覧', path: '/temp-passwords' },
        ],
      },
    });
  });

  it('モバイルメニューが開いている時にドロワー形式でメニューを表示する', async () => {
    render(<Sidebar isMobileMenuOpen={true} />);

    await waitFor(() => {
      expect(
        screen.getByRole('navigation', { name: 'モバイルメインナビゲーション' })
      ).toBeInTheDocument();
    });

    const mobileNavigation = screen.getByRole('navigation', {
      name: 'モバイルメインナビゲーション',
    });

    expect(within(mobileNavigation).getByText('パスワード検索')).toBeInTheDocument();
    expect(
      within(mobileNavigation).getByText('仮登録パスワード一覧')
    ).toBeInTheDocument();
  });
});
