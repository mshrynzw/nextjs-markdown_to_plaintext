# TimePort v4 Payroll

下記内容のモックを作成しました。

> 次世代の勤怠管理・チーム協働プラットフォーム「TimePort v4」の給与管理システムです。マルチテナント対応の包括的な業務管理ソリューションで、あらゆる規模の組織の生産性を向上させます。

モックのデータは、lib\mock配下のソースコードで記載・もしくはデータ生成するようになっています。
それらデータはcontexts\mock-context.tsxで管理し、データはブラウザのローカルストレージに保存されます。初期化もできます。

## 🚀 主な機能

### 管理者機能
- **勤怠管理**: 従業員の勤怠記録の確認・編集・承認
- **給与管理**: 給与計算・明細生成・支払い管理
- **ユーザー管理**: 従業員情報・権限管理
- **設定管理**: 会社情報・給与設定・勤務形態設定
- **ダッシュボード**: 組織全体の統計・分析

### 従業員機能
- **勤怠記録**: 自分の勤怠データの確認・編集
- **給与確認**: 給与明細の閲覧・確認
- **ダッシュボード**: 個人の勤務状況・通知確認

## 🛠 技術スタック

- **フレームワーク**: Next.js 15.5.3 (App Router)
- **言語**: TypeScript 5.2.2
- **スタイリング**: Tailwind CSS 3.3.3
- **UI コンポーネント**: Radix UI + shadcn/ui
- **状態管理**: React Hooks + Context API
- **バリデーション**: Zod
- **アイコン**: Lucide React
- **チャート**: Recharts
- **フォーム**: React Hook Form

## 📦 インストール

### 前提条件
- Node.js 18.0.0 以上
- pnpm (推奨) または npm

### 開発環境
- Cursor
  - 拡張機能
    - Thunder Client
    - Auto Close Tag
    - Auto Rename Tag Clone
    - Bracket Pair Colorizer 2
    - Claude Code for VSCode
    - DotENV
    - ES7+ React/Redux/React-Native snippets
    - ESLint
    - Import Cost
    - Japanese Language Pack for VS Code
    - JavaScript and TypeScript Nightly
    - Material Product Icons
    - Next.js App Router (TypeScript)
    - Nextjs App Directory Commands
    - Nextjs snippets
    - npm
    - npm Intellisense
    - Path Intellisense
    - Prettier - Code formatter
    - Spell Check
    - Tailwind CSS IntelliSense
    - TSLint
    - Typos spell checker
    - Zod Snippets
- Node.js
- nvm
- Git
- GitHub
- Source Tree

### セットアップ

1. リポジトリをクローン
```bash
git clone <repository-url>
cd timeport-v4_payroll
```

2. 依存関係をインストール
```bash
pnpm install
# または
npm install
```

3. 環境変数を設定
```bash
cp .env.example .env.local
# .env.local を編集して必要な環境変数を設定
```

4. 開発サーバーを起動
```bash
pnpm dev
# または
npm run dev
```

5. ブラウザで [http://localhost:3000](http://localhost:3000) を開く

## 🏗 プロジェクト構造

```
timeport-v4_payroll/
├── app/                          # Next.js App Router
│   ├── (protected)/             # 認証が必要なページ
│   │   ├── admin/               # 管理者用ページ
│   │   └── member/              # 従業員用ページ
│   ├── (public)/                # パブリックページ
│   └── globals.css              # グローバルスタイル
├── components/                   # React コンポーネント
│   ├── app/                     # アプリケーション固有コンポーネント
│   │   ├── admin/               # 管理者用コンポーネント
│   │   └── member/              # 従業員用コンポーネント
│   ├── common/                  # 共通コンポーネント
│   └── ui/                      # UI コンポーネント
├── contexts/                     # React Context
├── hooks/                        # カスタムフック
├── lib/                          # ユーティリティ・ヘルパー
│   ├── mock/                    # モックデータ
│   └── utils/                   # 共通ユーティリティ
├── schemas/                      # Zod スキーマ定義
└── public/                       # 静的ファイル
```

## 🎨 デザインシステム

- **カラーパレット**: 黄色・オレンジ系の暖色調
- **レスポンシブ**: モバイルファーストデザイン
- **アクセシビリティ**: WCAG 2.1 AA 準拠
- **アニメーション**: 滑らかなトランジション効果

## 🔧 開発コマンド

```bash
# 開発サーバー起動
pnpm dev

# プロダクションビルド
pnpm build

# プロダクションサーバー起動
pnpm start

# リント実行
pnpm lint

# リント + フォーマット修正
pnpm fix
```

## 📱 対応ブラウザ（タブレット・スマートホン含む）

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。詳細は [LICENSE](LICENSE) ファイルを参照してください。

---

**TimePort v4 Payroll** - 効率的な勤怠・給与管理で、チームの生産性を最大化しましょう。