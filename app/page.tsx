"use client"

import { useState } from "react"
import type { GenerateRequest, UnheardContext } from "@/types"
import { UNHEARD_CONTEXT_OPTIONS } from "@/types"
import styles from "./page.module.css"

export default function Home() {
  const [theme, setTheme] = useState("")
  const [background, setBackground] = useState("")
  const [selectedContexts, setSelectedContexts] = useState<Set<UnheardContext>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [draft, setDraft] = useState<string | null>(null)

  const toggleContext = (context: UnheardContext) => {
    const newContexts = new Set(selectedContexts)
    if (newContexts.has(context)) {
      newContexts.delete(context)
    } else {
      newContexts.add(context)
    }
    setSelectedContexts(newContexts)
  }

  const handleGenerate = async () => {
    if (!theme.trim() || !background.trim()) {
      return
    }

    setIsLoading(true)
    try {
      const request: GenerateRequest = {
        theme: theme.trim(),
        background: background.trim(),
        unheard_contexts: Array.from(selectedContexts),
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error("生成に失敗しました")
      }

      const data = await response.json()
      setDraft(data.draft)
    } catch (error) {
      console.error(error)
      alert("エラーが発生しました")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!draft) return
    try {
      await navigator.clipboard.writeText(draft)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        {/* 説明文 */}
        <section className={styles.intro}>
          <h1>KIKU</h1>
          <p>問いの下書きを生成するアプリケーション</p>
        </section>

        {/* 入力フォーム */}
        {draft === null && (
          <section className={styles.form}>
            {/* 入力① テーマ */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>今、どんなことについて聞いてみたいですか？</label>
              <p className={styles.hint}>（正式な言葉でなくて大丈夫です）</p>
              <textarea
                className={styles.textarea}
                placeholder="例：公共施設の使われ方、子育て支援、まちの居心地"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              />
            </div>

            {/* 入力② 背景 */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>なぜ、今それを聞きたいと思いましたか？</label>
              <p className={styles.hint}>（思いつく範囲で大丈夫です）</p>
              <textarea
                className={styles.textarea}
                placeholder="例：一部の人の声しか届いていない気がする、若い人の声があまり見えてこない"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
              />
            </div>

            {/* 入力③ 声が届いていないと感じる人 */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>これまで、あまり声が届いていないと感じるのはどんな人たちでしょうか？</label>
              <p className={styles.hint}>（複数選択可、すべて選択なしでも大丈夫です）</p>
              <div className={styles.checkboxGroup}>
                {UNHEARD_CONTEXT_OPTIONS.map((option) => (
                  <label key={option} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={selectedContexts.has(option)}
                      onChange={() => toggleContext(option)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              <p className={styles.note}>
                ※ ここで選んだからといって、特定の人に向けた問いになるわけではありません
              </p>
            </div>

            {/* 生成ボタン */}
            <button
              className={styles.generateButton}
              onClick={handleGenerate}
              disabled={isLoading || !theme.trim() || !background.trim()}
            >
              {isLoading ? "生成中..." : "問いの下書きを考えてみる"}
            </button>
          </section>
        )}

        {/* 出力結果 */}
        {draft !== null && (
          <section className={styles.output}>
            <div className={styles.draftContainer}>
              <pre className={styles.draftText}>{draft}</pre>
            </div>
            <div className={styles.outputActions}>
              <button className={styles.copyButton} onClick={handleCopy}>
                コピーする
              </button>
              <button
                className={styles.resetButton}
                onClick={() => {
                  setDraft(null)
                  setTheme("")
                  setBackground("")
                  setSelectedContexts(new Set())
                }}
              >
                もう一度考える
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
