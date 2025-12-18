import { NextRequest, NextResponse } from "next/server"
import type { GenerateRequest, GenerateResponse } from "@/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as GenerateRequest

    // ダミー生成（ここはプロンプト実装後に置き換える）
    const mode = (body.unheard_contexts && body.unheard_contexts.length > 0)
      ? "lowered_entry"
      : "default"

    const dummyDraft = `## 問いの構造

このプロセスは、${body.theme}について、
日常の経験や感じ方を思い出してもらう構成になっています。

---

### 問い①

${body.theme}について、最近利用したことはありますか？

- よく利用している
- たまに利用している
- ほとんど利用していない
- 名前は知っているが、使ったことはない

---

### 問い②

利用したときの印象に、近いものがあれば選んでください（複数可）

- 使いやすかった
- なんとなく入りづらかった
- 自分向けではない気がした
- 特に印象はない

---

### 問い③

もしよければ、「こうだったら、もう少し関わるかも」と思うことがあれば
自由に書いてください。
（書かなくても大丈夫です）

---

※ この問いは、意見を評価するためのものではありません。
日常の感じ方を知るための下書きです。`

    const response: GenerateResponse = {
      mode,
      draft: dummyDraft,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "生成に失敗しました" },
      { status: 500 }
    )
  }
}
