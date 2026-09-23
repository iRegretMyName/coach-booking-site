'use client'

import Link from 'next/link'
import { useState } from 'react'

const questions: Array<[string, string[]]> = [
  ['In the morning, how do you feel?', ['Tired even after sleep', 'Racing thoughts', 'Heavy / numb', 'Calm']],
  ['When family says something small, you:', ['React fast / shout', 'Overthink for hours', 'Shut down / go silent', 'Pause and respond']],
  ['Your sleep is:', ['Broken / light', 'Late due to overthinking', 'Too much, still tired', 'Deep but sometimes disturbed']],
  ['Your main pattern:', ['Anxiety / anger', 'Guilt / past memories looping', 'Feeling stuck / no energy', "Want spiritual growth but can't stay consistent"]],
  ['What do you want most?', ['To feel safe in my own body', 'To heal past karma / trauma', 'To heal relationships', 'To connect spiritual knowledge to daily life']],
]
const results = [['Fight Mode', 'Your system may be living with too much urgency. Start with a one-to-one Nervous System Regulation session.', 'Nervous System Regulation 1:1'], ['Flight / Mind Loop', 'Your mind may be working overtime to keep you safe. Core Transformation gives you room to understand the deeper pattern.', 'Core Transformation'], ['Freeze', 'When energy turns inward, even simple things can feel heavy. Begin with your environment and a one-to-one regulation session.', 'Environment + 1:1'], ['Seeking the Bridge', 'You are ready to bring spiritual knowledge into your daily experience. The Bridge was created for this work.', 'The Bridge Mentorship']]

export default function ResourcesPage() {
  const [answers, setAnswers] = useState<number[]>([])
  const [email, setEmail] = useState('')
  const [started, setStarted] = useState(false)
  const resultIndex = answers.length === questions.length ? Math.round(answers.reduce((total, answer) => total + answer, 0) / answers.length) : null
  const result = resultIndex === null ? null : results[resultIndex]

  return <main className="resources-page"><header className="resources-hero"><p className="eyebrow">FREE RESOURCES</p><h1>A softer place<br />to begin.</h1><p>Small, practical points of return for the moments when your nervous system asks for more care.</p></header><section className="quiz-section"><div className="quiz-intro"><p className="eyebrow">60-SECOND CHECK-IN</p><h2>What state is your nervous system in right now?</h2><p>There is no wrong result. This is simply an invitation to notice what your system may need.</p></div>{!started ? <button className="button button--ink" type="button" onClick={() => setStarted(true)}>Take the free quiz <span>→</span></button> : !result ? <div className="quiz-flow">{questions.map(([question, options], questionIndex) => <fieldset key={question}><legend><span>0{questionIndex + 1}</span>{question}</legend><div>{options.map((option, optionIndex) => <button type="button" className={answers[questionIndex] === optionIndex ? 'quiz-option quiz-option--selected' : 'quiz-option'} key={option} onClick={() => setAnswers((current) => { const next = [...current]; next[questionIndex] = optionIndex; return next })}>{option}</button>)}</div></fieldset>)}<p className="quiz-progress">{answers.length} of {questions.length} reflections selected</p></div> : <div className="quiz-result"><p className="eyebrow">YOUR GENTLE STARTING POINT</p><h2>{result[0]}</h2><p>{result[1]}</p><b>Suggested next step: {result[2]}</b><label>Your email (optional, to receive your result)</label><input type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} /><small>Email delivery will be activated when the studio newsletter is connected.</small><Link href="/book" className="button button--ink">Book your session <span>↗</span></Link></div>}</section><section className="audio-vault"><div><p className="eyebrow">FREE AUDIO VAULT</p><h2>Press pause,<br />wherever you are.</h2><p>Audio practices will appear here as the studio library is released.</p></div><div className="audio-list">{['5-Minute Morning Safety Breath', '11-Minute Mantra for Anxiety', '2-Minute Pause Before Reacting'].map((title, index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><button type="button" disabled aria-label={`${title} coming soon`}>Coming soon</button></article>)}</div></section></main>
}
