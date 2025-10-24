export interface HelpContent {
  title: string;
  description: string;
}

export const helpContents: Record<string, HelpContent> = {
  '/admin/dashboard': {
    title: '給与計算システムの概要',
    description: `<p class="mb-8 text-gray-700">このシステムは以下のステップにより給与計算がされます。</p>
     
     <!-- 給与計算フローチャート画像 -->
     <div class="mb-8 flex justify-center">
       <div class="relative w-full max-w-4xl">
         <img 
           src="/images/app/admin/dashboard/help.png" 
           alt="給与計算システムのフローチャート" 
           class="w-full h-auto rounded-lg shadow-sm border border-gray-200"
           style="aspect-ratio: 1219/327;"
         />
       </div>
     </div>
     
     <div class="flex justify-center">
      <ol class="space-y-3">
        <li class="flex items-start">
          <span class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-semibold mr-3">0</span>
          <div>
            <span class="font-semibold text-gray-900">初期状態</span>
            <p class="text-gray-700">ステータスはデフォルトで<span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium mx-1">【未処理】</span>となる。従業員は締め日までに勤怠の入力を完了させる。</p>
          </div>
        </li>
        <li class="flex items-start">
          <span class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-semibold mr-3">1</span>
          <div>
            <span class="font-semibold text-gray-900">給与自動計算</span>
            <p class="text-gray-700">従業員の勤怠の未入力がなく、締め日に給与を自動計算する。ステータスを<span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium mx-1">【承認待ち】</span>とする。</p>
          </div>
        </li>
        <li class="flex items-start">
          <span class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-semibold mr-3">2</span>
          <div>
            <span class="font-semibold text-gray-900">管理者承認</span>
            <p class="text-gray-700">管理者が計算結果を確認し、問題なければ、ステータスを<span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium mx-1">【承認済み】</span>とする。</p>
          </div>
        </li>
        <li class="flex items-start">
          <span class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-semibold mr-3">3</span>
          <div>
            <span class="font-semibold text-gray-900">給与支払い</span>
            <p class="text-gray-700">給与日に給与を支払い、ステータスを<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium mx-1">【支払完了】</span>とする。</p>
          </div>
        </li>
      </ol>
    </div>`,
  },
  '/admin/attendance': {
    title: '勤怠管理について',
    description: `<p class="mb-8 text-gray-700">勤怠管理画面では以下の機能が利用できます。</p>
    
    <div class="flex flex-col items-center justify-center space-y-4">
      <ul class="space-y-2 mb-4">
        <li class="flex items-center">
          <span class="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
          <span class="text-gray-700">勤怠記録の一覧表示と検索</span>
        </li>
        <li class="flex items-center">
          <span class="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
          <span class="text-gray-700">出勤・退勤時刻の編集</span>
        </li>
        <li class="flex items-center">
          <span class="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
          <span class="text-gray-700">勤務時間の自動計算</span>
        </li>
        <li class="flex items-center">
          <span class="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
          <span class="text-gray-700">遅刻・早退・欠勤の管理</span>
        </li>
        <li class="flex items-center">
          <span class="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
          <span class="text-gray-700">休憩時間の記録</span>
        </li>
        <li class="flex items-center">
          <span class="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
          <span class="text-gray-700">勤怠データのエクスポート</span>
        </li>
      </ul>
      
      <p class="text-gray-700 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
        各従業員の勤怠状況をリアルタイムで確認し、給与計算の基となるデータを管理できます。
      </p>
    </div>`,
  },
  '/admin/payroll': {
    title: '給与管理について',
    description: `<p class="mb-4 text-gray-700">給与管理画面では以下の機能が利用できます。</p>
    
     <div class="flex flex-col items-center justify-center space-y-4">
      <ul class="space-y-2 mb-4">
        <li class="flex items-center">
          <span class="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
          <span class="text-gray-700">給与計算結果の一覧表示</span>
        </li>
        <li class="flex items-center">
          <span class="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
          <span class="text-gray-700">給与明細の確認と承認</span>
        </li>
        <li class="flex items-center">
          <span class="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
          <span class="text-gray-700">残業時間の集計</span>
        </li>
        <li class="flex items-center">
          <span class="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
          <span class="text-gray-700">各種手当の計算</span>
        </li>
        <li class="flex items-center">
          <span class="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
          <span class="text-gray-700">給与支払い状況の管理</span>
        </li>
        <li class="flex items-center">
          <span class="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
          <span class="text-gray-700">給与データのエクスポート</span>
        </li>
      </ul>
      
      <p class="text-gray-700 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
        勤怠データを基に自動計算された給与を確認し、承認プロセスを管理できます。
      </p>
    </div>`,
  },
  '/admin/user': {
    title: 'ユーザー管理について',
    description: `<p class="mb-8 text-gray-700">ユーザー管理画面では以下の機能が利用できます。</p>
    
    <div class="flex flex-col items-center justify-center space-y-4">
      <ul class="space-y-2 mb-4">
        <li class="flex items-center">
          <span class="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
          <span class="text-gray-700">従業員情報の登録・編集・削除</span>
        </li>
        <li class="flex items-center">
          <span class="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
          <span class="text-gray-700">所属グループの管理</span>
        </li>
        <li class="flex items-center">
          <span class="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
          <span class="text-gray-700">勤務形態の設定</span>
        </li>
        <li class="flex items-center">
          <span class="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
          <span class="text-gray-700">権限（ロール）の管理</span>
        </li>
        <li class="flex items-center">
          <span class="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
          <span class="text-gray-700">従業員の検索とフィルタリング</span>
        </li>
        <li class="flex items-center">
          <span class="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
          <span class="text-gray-700">ユーザー情報の一括更新</span>
        </li>
      </ul>
      
      <p class="text-gray-700 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
        組織の人員構成を管理し、給与計算に必要な基本情報を設定できます。
      </p>
    </div>`,
  },
  '/admin/setting': {
    title: '設定について',
    description: `<p class="mb-4 text-gray-700">設定画面では以下の機能が利用できます。</p>
    
    <div class="flex justify-center">
      <ul class="space-y-2 mb-4">
        <li class="flex items-center">
          <span class="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
          <span class="text-gray-700">会社情報の編集・保存</span>
        </li>
        <li class="flex items-center">
          <span class="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
          <span class="text-gray-700">ユーザー情報の編集・保存</span>
        </li>
        <li class="flex items-center">
          <span class="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
          <span class="text-gray-700">給与の設定・保存</span>
        </li>
      </ul>
    </div>`,
  },
  '/member/dashboard': {
    title: 'メンバーダッシュボードについて',
    description: `<p class="mb-8 text-gray-700">メンバーダッシュボードでは以下の情報を確認できます。</p>
    
    <div class="flex justify-center flex-col items-center space-y-6">
      <div class="space-y-4">
        <h3 class="font-semibold text-gray-900">主な機能</h3>
        <ul class="flex  md:flex-colflex-row gap-8 md:space-y-2">
          <li class="flex items-center">
            <span class="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
            <span class="text-gray-700">出勤・退勤の打刻</span>
          </li>
          <li class="flex items-center">
            <span class="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
            <span class="text-gray-700">勤怠履歴の確認</span>
          </li>
          <li class="flex items-center">
            <span class="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
            <span class="text-gray-700">残業時間の確認</span>
          </li>
        </ul>
      </div>

       <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
         <h3 class="font-semibold text-gray-900 mb-2">出勤日数と残業時間の表示について</h3>
         <p class="text-gray-700 mb-2">出勤日数と残業時間は会社設定の締め日ベースで計算・表示されます：</p>
         <ul class="space-y-1 text-sm text-gray-700">
           <li>• <strong>今期間の対象</strong>：前回の締め日翌日から昨日まで</li>
           <li>• <strong>前期間の対象</strong>：前々回の締め日翌日から前回の締め日まで</li>
           <li>• <strong>比較</strong>：今期間と前期間のデータを比較して変化率を表示</li>
         </ul>
       </div>
    </div>`,
  },
};

export function getHelpContent(pathname: string): HelpContent | null {
  return helpContents[pathname] || null;
}
