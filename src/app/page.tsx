export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="text-white p-4 flex justify-between items-center w-full" style={{backgroundColor: '#3E3E3E'}}>
        <h1 className="text-xl font-bold">PMAPP</h1>
        <span className="text-xl">本園 裕哉</span>
      </header>

      {/* メインコンテンツエリア */}
      <div className="flex">
        {/* サイドバー */}
        <div className="w-48 text-white min-h-screen" style={{backgroundColor: '#3E3E3E'}}>
          {/* メニュー */}
          <nav>
            <div className="px-4 py-4 text-sm font-medium border-b border-gray-600 relative" style={{backgroundColor: '#555555'}}>
              アプリケーション一覧
              <div className="absolute right-0 top-0 bottom-0 w-1" style={{backgroundColor: '#3CB371'}}></div>
            </div>
            <div className="px-4 py-4 text-sm hover:bg-gray-600 cursor-pointer border-b border-gray-600">
              アカウント一覧
            </div>
            <div className="px-4 py-4 text-sm hover:bg-gray-600 cursor-pointer border-b border-gray-600">
              パスワード検索
            </div>
            <div className="px-4 py-4 text-sm hover:bg-gray-600 cursor-pointer border-b border-gray-600">
              未登録パスワード一覧
            </div>
            <div className="px-4 py-4 text-sm hover:bg-gray-600 cursor-pointer border-b border-gray-600">
              仮登録パスワード一覧
            </div>
          </nav>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">アプリケーション一覧</h2>
          
          {/* テーブル */}
          <div className="bg-white shadow overflow-hidden">
            <table className="w-full">
              <thead>
                <tr style={{backgroundColor: '#3E3E3E'}} className="text-white h-16">
                  <th className="px-6 py-3 text-center text-base font-medium border-r" style={{borderColor: '#3E3E3E'}}>アプリケーション名</th>
                  <th className="px-6 py-3 text-center text-base font-medium border-r" style={{borderColor: '#3E3E3E'}}>記号区分</th>
                  <th className="px-6 py-3 text-center text-base font-medium border-r" style={{borderColor: '#3E3E3E'}}>変更通知区分</th>
                  <th className="px-6 py-3 text-center text-base font-medium border-r" style={{borderColor: '#3E3E3E'}}>アカウント区分</th>
                  <th className="px-6 py-3 text-center text-base font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="h-16">
                  <td className="px-6 py-4 text-base text-gray-900 border-r text-left truncate" style={{borderColor: '#d1d5db'}}>Amazon</td>
                  <td className="px-6 py-4 text-base text-gray-900 border-r text-center" style={{borderColor: '#d1d5db'}}>あり</td>
                  <td className="px-6 py-4 text-base text-gray-900 border-r text-center" style={{borderColor: '#d1d5db'}}></td>
                  <td className="px-6 py-4 text-base text-gray-900 border-r text-center" style={{borderColor: '#d1d5db'}}></td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-white px-6 py-3 rounded text-sm font-medium" style={{backgroundColor: '#3CB371'}}>
                      詳細
                    </button>
                  </td>
                </tr>
                <tr className="h-16">
                  <td className="px-6 py-4 text-base text-gray-900 border-r text-left truncate" style={{borderColor: '#d1d5db'}}>XXX</td>
                  <td className="px-6 py-4 text-base text-gray-900 border-r text-center" style={{borderColor: '#d1d5db'}}>なし</td>
                  <td className="px-6 py-4 text-base text-gray-900 border-r text-center" style={{borderColor: '#d1d5db'}}></td>
                  <td className="px-6 py-4 text-base text-gray-900 border-r text-center" style={{borderColor: '#d1d5db'}}></td>
                  <td className="px-6 py-4 text-center"></td>
                </tr>
                <tr className="h-16">
                  <td className="px-6 py-4 text-base text-gray-900 border-r text-left truncate" style={{borderColor: '#d1d5db'}}>XXX</td>
                  <td className="px-6 py-4 text-base text-gray-900 border-r text-center" style={{borderColor: '#d1d5db'}}>...</td>
                  <td className="px-6 py-4 text-base text-gray-900 border-r text-center" style={{borderColor: '#d1d5db'}}></td>
                  <td className="px-6 py-4 text-base text-gray-900 border-r text-center" style={{borderColor: '#d1d5db'}}></td>
                  <td className="px-6 py-4 text-center"></td>
                </tr>
                <tr className="h-16">
                  <td className="px-6 py-4 text-base text-gray-900 border-r text-left truncate" style={{borderColor: '#d1d5db'}}>...</td>
                  <td className="px-6 py-4 text-base text-gray-900 border-r text-center" style={{borderColor: '#d1d5db'}}></td>
                  <td className="px-6 py-4 text-base text-gray-900 border-r text-center" style={{borderColor: '#d1d5db'}}></td>
                  <td className="px-6 py-4 text-base text-gray-900 border-r text-center" style={{borderColor: '#d1d5db'}}></td>
                  <td className="px-6 py-4 text-center"></td>
                </tr>
                {/* 空の行を追加してテーブルの高さを確保 */}
                {Array.from({ length: 6 }, (_, index) => (
                  <tr key={index} className="h-16">
                    <td className="px-6 py-4 text-base text-gray-900 border-r text-left truncate" style={{borderColor: '#d1d5db'}}></td>
                    <td className="px-6 py-4 text-base text-gray-900 border-r text-center" style={{borderColor: '#d1d5db'}}></td>
                    <td className="px-6 py-4 text-base text-gray-900 border-r text-center" style={{borderColor: '#d1d5db'}}></td>
                    <td className="px-6 py-4 text-base text-gray-900 border-r text-center" style={{borderColor: '#d1d5db'}}></td>
                    <td className="px-6 py-4 text-center"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
