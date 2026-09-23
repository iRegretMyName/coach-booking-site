'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

const questions = [
  ['In the morning, I most often feel…', ['rushed or on edge', 'caught in thoughts', 'flat or withdrawn', 'fairly settled']],
  ['When a small thing happens at home, I tend to…', ['react quickly', 'replay it for a long time', 'go quiet or numb', 'pause before responding']],
  ['Right now, I would most value…', ['a way to settle', 'understanding a repeating pattern', 'more support in relationships', 'a steadier spiritual practice']],
] as const

const reflections = [
  ['Urgency is taking up a lot of room', 'Your responses suggest that moments may be arriving with a lot of speed or pressure. A small pause before reacting may be more useful than trying to solve everything at once.', 'Nervous System Regulation 1:1'],
  ['Your mind may be carrying a lot', 'Your responses suggest that thoughts and old loops may be asking for attention. Reflection, writing and a slower conversation can help make a pattern more visible.', 'Core Transformation'],
  ['There may be a need for gentler support', 'Your responses suggest that rest, safety and connection may be especially important right now. Start with the smallest practice that feels possible.', 'Environment Regulation or 1:1'],
  ['You may be ready to integrate what you know', 'Your responses suggest an interest in bringing insight into everyday life. A regular practice can help turn understanding into something lived.', 'The Bridge'],
] as const

export default function ResourcesPage() {
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1))
  const complete = answers.every((answer) => answer >= 0)
  const result = useMemo(() => complete ? reflections[Math.round(answers.reduce((total, answer) => total + answer, 0) / answers.length)] : null, [answers, complete])
  return <main className="resources-page"><header className="resources-hero"><p className="eyebrow">FREE REFLECTION TOOL</p><h1>A quieter way<br />to notice.</h1><p>This is not a diagnosis or clinical assessment. It is a short invitation to notice what kind of support may feel useful today.</p></header><section className="quiz-section"><div className="quiz-intro"><p className="eyebrow">THREE-MINUTE CHECK-IN</p><h2>What feels most present?</h2><p>There is no right result. Choose the answer that feels closest, not the answer you think you should give.</p></div><div className="quiz-flow">{questions.map(([question, options], questionIndex) => <fieldset key={question}><legend><span>0{questionIndex + 1}</span>{question}</legend><div>{options.map((option, optionIndex) => <button type="button" className={answers[questionIndex] === optionIndex ? 'quiz-option quiz-option--selected' : 'quiz-option'} key={option} onClick={() => setAnswers((current) => current.map((answer, index) => index === questionIndex ? optionIndex : answer))}>{option}</button>)}</div></fieldset>)}<p className="quiz-progress">{answers.filter((answer) => answer >= 0).length} of {questions.length} reflections selected</p>{result && <div className="quiz-result"><p className="eyebrow">A POSSIBLE STARTING POINT</p><h2>{result[0]}</h2><p>{result[1]}</p><b>One option to explore: {result[2]}</b><small>This reflection is for personal insight only; it does not diagnose a condition or replace professional, medical or crisis care.</small><Link href="/book" className="button button--ink">Explore support <span>↗</span></Link></div>}</div></section><section className="resources-next"><p className="eyebrow">CONTINUE GENTLY</p><h2>Read, reflect, then decide what is useful.</h2><p>The Presence Journal offers longer reflections on relationships, sound, home and nervous-system patterns—with no pressure to turn every insight into an action.</p><Link href="/Blog" className="text-link">Enter the Journal <span>→</span></Link></section></main>
}
