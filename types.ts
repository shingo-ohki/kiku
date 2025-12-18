// API リクエスト/レスポンス の型定義

export type GenerateRequest = {
  theme: string
  background: string
  unheard_contexts?: string[]
}

export type GenerateResponse = {
  mode: "default" | "lowered_entry"
  draft: string
}

// 声が届いていないと感じる人のオプション
export const UNHEARD_CONTEXT_OPTIONS = [
  "忙しくて参加できていない人",
  "意見を言うほどではないと思っている人",
  "制度や仕組みがよく分からない人",
  "普段あまり行政と接点がない人",
  "特に思い浮かばない",
] as const

export type UnheardContext = (typeof UNHEARD_CONTEXT_OPTIONS)[number]
