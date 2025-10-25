# Markdown-To-PlainText

MarkdownをPlainTextに変換するシンプルで使いやすいWebアプリケーションです。リアルタイムでMarkdownをプレーンテキストに変換し、コピー機能も搭載しています。

## 🚀 主な機能

- **リアルタイム変換**: Markdownを入力すると即座にPlainTextに変換
- **双方向表示**: MarkdownとPlainTextを並べて表示（デスクトップ）またはタブ切り替え（モバイル）
- **コピー機能**: 変換されたPlainTextをワンクリックでコピー
- **ペースト機能**: クリップボードからMarkdownを直接貼り付け
- **レスポンシブデザイン**: デスクトップ・タブレット・スマートフォンに対応
- **PWA対応**: アプリとしてインストール可能

## 🛠 技術スタック

- **フレームワーク**: Next.js 15.5.3 (App Router)
- **言語**: TypeScript 5.2.2
- **スタイリング**: Tailwind CSS 3.3.3
- **UI コンポーネント**: Radix UI + shadcn/ui
- **状態管理**: React Hooks + Context API
- **Markdown処理**: カスタム変換ロジック
- **アイコン**: Lucide React

## 📦 インストール

### 前提条件
- Node.js 18.0.0 以上
- pnpm (推奨) または npm

### セットアップ

1. リポジトリをクローン
```bash
git clone <repository-url>
cd nextjs-markdown_to_plaintext
```

2. 依存関係をインストール
```bash
pnpm install
# または
npm install
```

3. 開発サーバーを起動
```bash
pnpm dev
# または
npm run dev
```

4. ブラウザで [http://localhost:3000](http://localhost:3000) を開く

## 🏗 プロジェクト構造

```
nextjs-markdown_to_plaintext/
├── app/                          # Next.js App Router
│   ├── globals.css              # グローバルスタイル
│   ├── layout.tsx               # ルートレイアウト
│   └── page.tsx                 # メインページ
├── components/                   # React コンポーネント
│   ├── app/                     # アプリケーション固有コンポーネント
│   │   ├── ContentDesktop.tsx   # デスクトップ用レイアウト
│   │   ├── ContentMobile.tsx    # モバイル用レイアウト
│   │   ├── MarkdownTextArea.tsx # Markdown入力エリア
│   │   └── PlainTextArea.tsx    # PlainText表示エリア
│   ├── common/                  # 共通コンポーネント
│   ├── markdown/                # Markdown関連コンポーネント
│   └── ui/                      # UI コンポーネント
├── contexts/                     # React Context
│   └── active-tab-context.tsx   # タブ状態管理
├── lib/                          # ユーティリティ・ヘルパー
│   └── markdown/                # Markdown変換ロジック
└── public/                       # 静的ファイル
```

## 🎨 デザインシステム

- **カラーパレット**: モダンでクリーンなデザイン
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

## 📱 使用方法

1. **Markdown入力**: 左側（デスクトップ）または「Markdown」タブ（モバイル）にMarkdownテキストを入力
2. **リアルタイム変換**: 入力と同時にPlainTextに変換されます
3. **コピー**: 変換されたPlainTextを「Copy」ボタンでクリップボードにコピー
4. **ペースト**: 「Paste Markdown」ボタンでクリップボードからMarkdownを貼り付け

## 📱 対応ブラウザ

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。詳細は [LICENSE](LICENSE) ファイルを参照してください。

---

**Markdown-To-PlainText** - シンプルで効率的なMarkdown変換ツールで、テキスト変換を簡単にしましょう。