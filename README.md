# KIKU

問いの下書きを生成するアプリケーション（Next.js 14）。

## 環境変数（フロントエンド）

`.env.local` に以下を設定します。

```
# Railway にデプロイした API のベースURL
# 例）https://kiku-api-xxxxxxxx.up.railway.app
NEXT_PUBLIC_API_BASE_URL=
```

- 未設定（空）の場合は、ローカルの Next.js API ルート（`/api/generate`）を叩きます。
- Cloudflare Pages で公開する場合は、Railway の API URL を設定してください。

## 開発（ローカル）

```bash
npm install
npm run dev
```

オプション：Railway の API をローカルで使う場合は `.env.local` に下記を設定。

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## 本番構成（推奨）

- UI（本リポジトリ）：Cloudflare Pages（静的エクスポート）
	- `next.config.js` に `output: "export"` を設定
	- Build command: `npm run build`
	- Build output directory: `out`
- 生成 API：Railway（別リポジトリの `kiku-api`）
	- エンドポイント例：`https://kiku-api-xxxx.up.railway.app/api/generate`
	- Cloudflare Pages の環境変数 `NEXT_PUBLIC_API_BASE_URL` に上記ベースURLを設定

## 疎通確認チェックリスト

- Cloudflare Pages の環境変数に `NEXT_PUBLIC_API_BASE_URL` を設定したか
- UI の「問いの下書きを考えてみる」で生成が完了するか
- 失敗時のメッセージが表示されるか（ネットワーク・CORS）

## 注意事項

- Cloudflare Pages（静的エクスポート）では Next.js の API Routes は動作しません。
	- 本番は Railway の API を利用してください。
	- ローカル開発では未設定時に `/api/generate` を叩くため、OpenAI 直結の実装を使う場合は注意。
