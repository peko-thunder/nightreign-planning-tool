# プロジェクト

## 概要

2025年にフロム・ソフトウェアが開発したゲーム「ELDEN RING NIGHTREIGN」を対象。
Youtube配信やDiscordコミュニティなどの企画に用いるためのツールを本プロジェクトで扱います。

このツールはWeb上で公開されます。

本プロジェクトのツールは、ゲームを直接ハックするものや攻略を有利にするものではありません。

## 企画ツール

### 夜渡りルーレット

事前にルーレットを実行し、マッチングしたプレイヤーはそれぞれのキャラクターを使用する縛り。
マッチング画面でプレイヤーの色(青, 赤, 緑)が表示されるので、それを元にキャラクターを選択。

**主な機能:**
- プレイアブルキャラクターからのランダム選択
- 3プレイヤー同時割当
- キャラクター被り許可/禁止オプション
- 前回のキャラクターを除外するオプション
  - ルーレット停止時に選択結果を記録
  - 次回ルーレット開始時に前回キャラクターを除外
  - 除外中のキャラクターは赤い×マークで視覚化
  - オプション無効化またはリセットで除外解除
- キャラクター種別フィルタ（解放キャラ、DLCキャラ）
- 回転アニメーション付きルーレット演出

## 技術スタック

- **フレームワーク:** Next.js 16（App Router、静的エクスポート）
- **言語:** TypeScript 5（厳密モード）
- **UI:** React 19
- **スタイリング:** Tailwind CSS 3
- **分析:** Vercel Analytics
- **デプロイ:** 静的サイト生成（SSG）

## ディレクトリ構造

```
src/
├── app/
│   ├── layout.tsx        # ルートレイアウト（メタデータ、Analytics）
│   ├── page.tsx          # ホームページ
│   └── globals.css       # グローバルスタイル、カスタムアニメーション
├── components/
│   ├── Roulette.tsx      # メインコンポーネント（状態管理）
│   ├── PlayerSlot.tsx    # プレイヤースロット表示
│   ├── CharacterSelect.tsx # キャラクター一覧表示
│   └── CharacterIcon.tsx # キャラクターアイコン
└── data/
    └── characters.ts     # キャラクターデータ、型定義

public/
└── characters/           # キャラクター画像（プレイアブルキャラクター全種）
```

## コンポーネント設計

### データレイヤー (`src/data/characters.ts`)

**型定義:**
- `CharacterType`: "base" | "unlock" | "dlc"
- `Character`: id, name, nameEn, type, color
- `PlayerColor`: "blue" | "red" | "green"
- `Player`: id, color, name, character

**キャラクター一覧:**
| 名前 | 英名 | 種別 |
|------|------|------|
| 追跡者 | Seeker | base |
| 守護者 | Guardian | base |
| 鉄の目 | Iron Eye | base |
| 無頼漢 | Raider | base |
| 隠者 | Hermit | base |
| 執行者 | Executor | base |
| レディ | Lady | unlock |
| 復讐者 | Avenger | unlock |
| 学者 | Scholar | dlc |
| 葬儀屋 | Undertaker | dlc |

### UIコンポーネント

- **Roulette:** アプリ全体の状態管理、ルーレットロジック、除外キャラクター管理
  - `lastSelectedCharacters`: 前回の選択結果を保存
  - `previousCharacters`: 除外対象キャラクター（×マーク表示用）
  - `excludePreviousCharacters`: 除外オプションの有効/無効状態
- **PlayerSlot:** プレイヤーごとのキャラ表示、アニメーション
- **CharacterSelect:** キャラ一覧グリッド、選択状態の可視化、除外状態の表示
  - `excludedCharacterIds`: 除外中のキャラクターIDセット
- **CharacterIcon:** 個別アイコン、ホバー効果、ロック表示、除外マーク表示
  - `isExcluded`: 除外状態（赤い×マーク、不透明度40%）
  - 除外中はルーレット動作時のフォーカス無効

## 開発コマンド

```bash
npm run dev      # 開発サーバー起動
npm run build    # プロダクションビルド
npm run start    # プロダクションサーバー起動
npm run lint     # ESLintチェック
```

## カスタムテーマ

Tailwind CSS設定（`tailwind.config.ts`）でNIGHTREIGNテーマカラーを定義:

```
nightreign-bg:    #0a0a0f  (背景)
nightreign-dark:  #12121a  (ダーク)
nightreign-gold:  #c9a227  (ゴールド/強調)
nightreign-blue:  #3b82f6  (プレイヤーBlue)
nightreign-red:   #ef4444  (プレイヤーRed)
nightreign-green: #22c55e  (プレイヤーGreen)
```

## パスエイリアス

```typescript
import { characters } from '@/data/characters'
import { Roulette } from '@/components/Roulette'
```

`@/*` は `./src/*` にマッピング。

## デプロイ設定

- `next.config.ts`: `output: "export"` で静的エクスポート
- 画像最適化は無効化（`unoptimized: true`）
- Vercelへのデプロイに最適化

## Claude Code Hooks

Claude Codeの動作をカスタマイズするhooksを設定。

### 設定ファイル

- **設定:** `.claude/settings.json`
- **スクリプト:** `.claude/hooks/`

### PreToolUse フック

ツール実行前に発火するフック。

| 対象ツール | スクリプト | 説明 |
|-----------|-----------|------|
| Read, Grep | `read_hook.js` | `.env`ファイルへのアクセスをブロック |

**read_hook.js の動作:**
- 読み取り対象パスに`.env`が含まれる場合、エラーを出力して処理を中断（exit code 2）
- 機密情報の漏洩防止が目的

### PostToolUse フック

ツール実行後に発火するフック。

| 対象ツール | 処理 | 説明 |
|-----------|------|------|
| Write, Edit, MultiEdit | Prettier | 編集されたファイルを自動フォーマット |
| Write, Edit, MultiEdit | `tsc.js` | TypeScript型チェックを実行 |

**Prettier の動作:**
- `npx prettier --write`で編集ファイルをフォーマット
- エラーは無視して処理を継続

**tsc.js の動作:**
- `.ts`/`.tsx`ファイルの編集時のみ実行
- `tsconfig.json`を使用して型チェック（`noEmit: true`）
- 型エラーがある場合、エラーを出力して処理を中断（exit code 2）
- 型安全性の維持が目的
