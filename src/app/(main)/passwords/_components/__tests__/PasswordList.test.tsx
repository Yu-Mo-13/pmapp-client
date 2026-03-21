import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import PasswordList from '../PasswordList';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('nuqs', () => ({
  useQueryState: jest.fn(),
  parseAsInteger: {
    withOptions: jest.fn().mockReturnThis(),
  },
}));

jest.mock('next/image', () => {
  return function MockImage({
    src,
    alt,
    width,
    height,
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
  }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} width={width} height={height} />;
  };
});

describe('PasswordList', () => {
  const mockPush = jest.fn();
  const mockSetApplicationId = jest.fn();
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
  const mockUseQueryState =
    useQueryState as jest.MockedFunction<typeof useQueryState>;

  beforeEach(() => {
    mockPush.mockReset();
    mockSetApplicationId.mockReset();

    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    } as ReturnType<typeof useRouter>);
    mockUseQueryState.mockReturnValue([
      2,
      mockSetApplicationId,
    ] as unknown as ReturnType<typeof useQueryState>);
  });

  it('アプリ選択変更時にクエリを付けて再取得する', async () => {
    const user = userEvent.setup();

    render(
      <PasswordList
        title="パスワード検索"
        rows={[]}
        applications={[
          { id: 1, name: 'GitHub' },
          { id: 3, name: 'Slack' },
        ]}
        selectedApplicationId="2"
      />
    );

    await user.selectOptions(
      screen.getByRole('combobox', { name: '' }),
      screen.getByRole('option', { name: 'Slack' })
    );

    expect(mockSetApplicationId).toHaveBeenCalledWith(3);
  });

  it('エラーメッセージを表示する', () => {
    render(
      <PasswordList
        title="パスワード検索"
        rows={[]}
        applications={[]}
        errorMessage="入力データに問題があります。"
      />
    );

    expect(screen.getByText('入力データに問題があります。')).toBeInTheDocument();
    expect(screen.getByText('パスワード一覧を表示できません。')).toBeInTheDocument();
  });
});
