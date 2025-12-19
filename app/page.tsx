"use client"

import { useState } from "react"
import type { GenerateRequest, UnheardContext, QuestionStructure } from "@/types"
import { UNHEARD_CONTEXT_OPTIONS } from "@/types"
import styles from "./page.module.css"

export default function Home() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""
  const [theme, setTheme] = useState("")
  const [background, setBackground] = useState("")
  const [selectedContexts, setSelectedContexts] = useState<Set<UnheardContext>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [structure, setStructure] = useState<QuestionStructure | null>(null)

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

      const endpoint = API_BASE_URL ? `${API_BASE_URL.replace(/\/$/, "")}/api/generate` : "/api/generate"
      const response = await fetch(endpoint, {
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
      setStructure(data.structure)
    } catch (error) {
      console.error(error)
      alert("エラーが発生しました")
    } finally {
      setIsLoading(false)
    }
  }

  const generateCopyText = (structure: QuestionStructure): string => {
    let text = `【問いの構造】\n${structure.explanation}\n\n`
    text += "━━━━━━━━━━━━━━━━━━━━━━\n\n"

    structure.questions.forEach((q) => {
      text += `【問い${q.number}】${q.title}\n\n`
      text += `${q.text}\n\n`

      if (q.type === "choice" && q.options) {
        q.options.forEach((opt) => {
          text += `□ ${opt}\n`
        })
        text += "\n"
      } else {
        text += "［自由記述欄］\n\n"
      }

      text += "━━━━━━━━━━━━━━━━━━━━━━\n\n"
    })

    text += structure.note
    return text
  }

  const handleCopy = async () => {
    if (!structure) return
    try {
      const copyText = generateCopyText(structure)
      await navigator.clipboard.writeText(copyText)
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
        {structure === null && (
          <section className={styles.form}>
            {/* 入力① テーマ */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                今回、住民の感じ方を聞こうとしている
                <br />
                事業・制度・テーマは何ですか？
              </label>
              <p className={styles.hint}>（正式名称でなくて構いません。そのまま書いてください）</p>
              <textarea
                className={styles.textarea}
                placeholder="例：○○市立図書館の利用について、子育て支援制度全般、駅前再整備計画"
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
        {structure !== null && (
          <section className={styles.output}>
            <div className={styles.draftContainer}>
              <div className={styles.explanation}>
                <h3>問いの構造</h3>
                <p>{structure.explanation}</p>
              </div>

              {structure.questions.map((q) => (
                <div key={q.number} className={styles.question}>
                  <h4>
                    問い{q.number}：{q.title}
                  </h4>
                  <p className={styles.questionText}>{q.text}</p>
                  {q.type === "choice" && q.options && (
                    <ul className={styles.options}>
                      {q.options.map((opt, idx) => (
                        <li key={idx}>{opt}</li>
                      ))}
                    </ul>
                  )}
                  {q.type === "text" && (
                    <div className={styles.textArea}>[自由記述欄]</div>
                  )}
                </div>
              ))}

              <div className={styles.note}>
                {structure.note.split("\n").map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            </div>

            <div className={styles.outputActions}>
              <button className={styles.copyButton} onClick={handleCopy}>
                コピーする
              </button>
              <button
                className={styles.resetButton}
                onClick={() => {
                  setStructure(null)
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
