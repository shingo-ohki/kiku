import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "KIKU",
  description: "問いの下書きを生成するアプリケーション",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
