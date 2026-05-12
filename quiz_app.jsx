import { useState, useEffect, useCallback, useRef } from "react";

const QUIZ_DATA = {
  title: "Science & Tech Trivia",
  description: "10 questions spanning space, biology, computing, and physics. You have 60 seconds per question. Wrong skip = −1 point.",
  totalTime: 60,
  questions: [
    {
      id: 1,
      question: "Which planet in our solar system has the most known moons?",
      options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
      correct: 1,
      explanation: "Saturn has 146 confirmed moons, surpassing Jupiter's 95."
    },
    {
      id: 2,
      question: "What does DNA stand for?",
      options: ["Dynamic Nucleic Acid", "Deoxyribonucleic Acid", "Dinitrogen Amino Acid", "Dual Nucleotide Array"],
      correct: 1,
      explanation: "DNA stands for Deoxyribonucleic Acid, the molecule carrying genetic information."
    },
    {
      id: 3,
      question: "Which programming language was created by Guido van Rossum?",
      options: ["Ruby", "Perl", "Python", "Swift"],
      correct: 2,
      explanation: "Python was created by Guido van Rossum and first released in 1991."
    },
    {
      id: 4,
      question: "What is the speed of light in a vacuum (approximately)?",
      options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "186,000 km/s"],
      correct: 0,
      explanation: "The speed of light is approximately 299,792 km/s, commonly rounded to 300,000 km/s."
    },
    {
      id: 5,
      question: "Which element has the atomic number 79?",
      options: ["Silver", "Platinum", "Gold", "Copper"],
      correct: 2,
      explanation: "Gold (Au) has atomic number 79 on the periodic table."
    },
    {
      id: 6,
      question: "What year was the World Wide Web invented?",
      options: ["1984", "1989", "1993", "1995"],
      correct: 1,
      explanation: "Tim Berners-Lee invented the World Wide Web in 1989 at CERN."
    },
    {
      id: 7,
      question: "The human body has approximately how many bones?",
      options: ["106", "176", "206", "256"],
      correct: 2,
      explanation: "An adult human body has 206 bones. Babies are born with around 270."
    },
    {
      id: 8,
      question: "What does GPU stand for?",
      options: ["General Processing Unit", "Graphics Processing Unit", "Global Program Utility", "Grid Power Unit"],
      correct: 1,
      explanation: "GPU stands for Graphics Processing Unit, originally designed for rendering graphics."
    },
    {
      id: 9,
      question: "Which scientist proposed the theory of general relativity?",
      options: ["Isaac Newton", "Nikola Tesla", "Albert Einstein", "Niels Bohr"],
      correct: 2,
      explanation: "Albert Einstein published the theory of general relativity in 1915."
    },
    {
      id: 10,
      question: "What is the largest organ in the human body?",
      options: ["Liver", "Brain", "Lung", "Skin"],
      correct: 3,
      explanation: "The skin is the largest organ, covering about 2 square meters on an adult."
    }
  ]
};

const TIMER_MAX = QUIZ_DATA.totalTime;

function CircularTimer({ timeLeft, total }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const frac = timeLeft / total;
  const offset = circ * (1 - frac);
  const danger = timeLeft <= 10;
  const warn = timeLeft <= 20;
  return (
    <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
      <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
        <circle
          cx="36" cy="36" r={r} fill="none"
          stroke={danger ? "#ff4d6d" : warn ? "#ffd166" : "#06d6a0"}
          strokeWidth="5"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.3s" }}
        />
      </svg>
      <span style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Space Mono', monospace", fontSize: 15, fontWeight: 700,
        color: danger ? "#ff4d6d" : warn ? "#ffd166" : "#e0e0e0"
      }}>
        {timeLeft}
      </span>
    </div>
  );
}

function StartScreen({ onStart }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      minHeight: "100vh", padding: "24px",
      background: "radial-gradient(ellipse at 60% 20%, #1a1a2e 0%, #0d0d1a 60%, #000 100%)"
    }}>
      {/* Decorative grid */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }} />

      <div style={{ position: "relative", maxWidth: 560, width: "100%", textAlign: "center" }}>
        <div style={{
          display: "inline-block", padding: "4px 14px", marginBottom: 20,
          border: "1px solid rgba(6,214,160,0.4)", borderRadius: 99,
          fontSize: 11, letterSpacing: 3, textTransform: "uppercase",
          color: "#06d6a0", fontFamily: "'Space Mono', monospace"
        }}>
          Multiple Choice · Timed
        </div>

        <h1 style={{
          fontFamily: "'Syne', sans-serif", fontSize: "clamp(36px, 8vw, 68px)",
          fontWeight: 800, lineHeight: 1, margin: "0 0 16px",
          color: "#fff",
          textShadow: "0 0 80px rgba(6,214,160,0.3)"
        }}>
          {QUIZ_DATA.title}
        </h1>

        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.7,
          color: "rgba(255,255,255,0.55)", margin: "0 0 40px", maxWidth: 420, marginLeft: "auto", marginRight: "auto"
        }}>
          {QUIZ_DATA.description}
        </p>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 48, flexWrap: "wrap" }}>
          {[
            { label: "Questions", value: QUIZ_DATA.questions.length },
            { label: "Time / Q", value: `${TIMER_MAX}s` },
            { label: "Penalty", value: "−1 pt" }
          ].map(s => (
            <div key={s.label} style={{
              padding: "14px 24px", borderRadius: 12,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              minWidth: 90
            }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 22, fontWeight: 700, color: "#06d6a0" }}>{s.value}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1.5, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          style={{
            padding: "16px 56px", borderRadius: 12, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #06d6a0, #0096c7)",
            color: "#000", fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 800,
            letterSpacing: 1, textTransform: "uppercase",
            boxShadow: "0 0 40px rgba(6,214,160,0.35)",
            transition: "transform 0.15s, box-shadow 0.15s"
          }}
          onMouseEnter={e => { e.target.style.transform = "scale(1.04)"; e.target.style.boxShadow = "0 0 60px rgba(6,214,160,0.55)"; }}
          onMouseLeave={e => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = "0 0 40px rgba(6,214,160,0.35)"; }}
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
}

const OPTION_LETTERS = ["A", "B", "C", "D"];

function QuestionCard({ question, qIndex, total, score, onAnswer, onTimeout }) {
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_MAX);
  const [revealed, setRevealed] = useState(false);
  const timerRef = useRef(null);
  const nextRef = useRef(null);

  const handleReveal = useCallback((idx) => {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
    clearInterval(timerRef.current);

    if (idx === question.correct) {
      // correct — advance after delay
    }
    nextRef.current = setTimeout(() => onAnswer(idx), 1800);
  }, [revealed, question.correct, onAnswer]);

  // timer
  useEffect(() => {
    setSelected(null);
    setRevealed(false);
    setTimeLeft(TIMER_MAX);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          // timeout — treat as skipped
          setRevealed(true);
          nextRef.current = setTimeout(() => onTimeout(), 1200);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { clearInterval(timerRef.current); clearTimeout(nextRef.current); };
  }, [question.id]);

  const getOptionStyle = (idx) => {
    const base = {
      width: "100%", padding: "14px 20px", borderRadius: 10, cursor: revealed ? "default" : "pointer",
      border: "1.5px solid", fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500,
      textAlign: "left", display: "flex", alignItems: "center", gap: 12,
      transition: "all 0.25s", position: "relative", overflow: "hidden"
    };
    if (!revealed) return {
      ...base, background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: "#e0e0e0"
    };
    if (idx === question.correct) return {
      ...base, background: "rgba(6,214,160,0.15)", borderColor: "#06d6a0", color: "#06d6a0", fontWeight: 700
    };
    if (idx === selected && idx !== question.correct) return {
      ...base, background: "rgba(255,77,109,0.15)", borderColor: "#ff4d6d", color: "#ff4d6d", fontWeight: 700
    };
    return { ...base, background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" };
  };

  const getIcon = (idx) => {
    if (!revealed) return null;
    if (idx === question.correct) return "✓";
    if (idx === selected && idx !== question.correct) return "✗";
    return null;
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      minHeight: "100vh", padding: "24px",
      background: "radial-gradient(ellipse at 60% 20%, #1a1a2e 0%, #0d0d1a 60%, #000 100%)"
    }}>
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }} />

      <div style={{ position: "relative", maxWidth: 620, width: "100%" }}>
        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            <span style={{ color: "#06d6a0", fontWeight: 700 }}>{qIndex + 1}</span>/{total}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Score</span>
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: score < 0 ? "#ff4d6d" : "#06d6a0" }}>{score >= 0 ? `+${score}` : score}</span>
          </div>
          <CircularTimer timeLeft={timeLeft} total={TIMER_MAX} />
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 99, marginBottom: 32, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 99,
            background: "linear-gradient(90deg, #06d6a0, #0096c7)",
            width: `${((qIndex) / total) * 100}%`,
            transition: "width 0.5s ease"
          }} />
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.035)", borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)",
          padding: "32px 36px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)"
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(16px, 3vw, 20px)",
            fontWeight: 600, color: "#fff", lineHeight: 1.5, marginBottom: 28
          }}>
            {question.question}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {question.options.map((opt, idx) => (
              <button key={idx} style={getOptionStyle(idx)}
                onClick={() => !revealed && handleReveal(idx)}
                onMouseEnter={e => { if (!revealed) e.currentTarget.style.borderColor = "rgba(6,214,160,0.4)"; e.currentTarget.style.background = "rgba(6,214,160,0.06)"; }}
                onMouseLeave={e => { if (!revealed) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; } }}
              >
                <span style={{
                  width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: revealed
                    ? idx === question.correct ? "rgba(6,214,160,0.25)"
                    : idx === selected ? "rgba(255,77,109,0.25)" : "rgba(255,255,255,0.06)"
                    : "rgba(255,255,255,0.08)",
                  fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700,
                  color: revealed
                    ? idx === question.correct ? "#06d6a0"
                    : idx === selected ? "#ff4d6d" : "rgba(255,255,255,0.25)"
                    : "rgba(255,255,255,0.5)"
                }}>
                  {revealed && getIcon(idx) ? getIcon(idx) : OPTION_LETTERS[idx]}
                </span>
                <span>{opt}</span>
              </button>
            ))}
          </div>

          {revealed && (
            <div style={{
              marginTop: 20, padding: "12px 16px", borderRadius: 10,
              background: selected === question.correct
                ? "rgba(6,214,160,0.08)"
                : selected === null
                  ? "rgba(255,200,0,0.08)"
                  : "rgba(255,77,109,0.08)",
              border: `1px solid ${selected === question.correct ? "rgba(6,214,160,0.2)" : selected === null ? "rgba(255,200,0,0.2)" : "rgba(255,77,109,0.2)"}`,
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.6,
              color: selected === question.correct ? "#06d6a0" : selected === null ? "#ffd166" : "#ff9eb5"
            }}>
              {selected === null
                ? `⏱ Time's up! — ${question.explanation}`
                : selected === question.correct
                  ? `✓ Correct! — ${question.explanation}`
                  : `✗ Not quite. — ${question.explanation}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultScreen({ results, score, total, onRetry }) {
  const pct = Math.max(0, Math.round((score / total) * 100));
  const grade = pct >= 90 ? { label: "Outstanding", color: "#06d6a0" }
    : pct >= 70 ? { label: "Great Job", color: "#0096c7" }
    : pct >= 50 ? { label: "Not Bad", color: "#ffd166" }
    : { label: "Keep Practicing", color: "#ff4d6d" };

  return (
    <div style={{
      minHeight: "100vh", padding: "32px 24px",
      background: "radial-gradient(ellipse at 60% 20%, #1a1a2e 0%, #0d0d1a 60%, #000 100%)",
      display: "flex", flexDirection: "column", alignItems: "center"
    }}>
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }} />

      <div style={{ position: "relative", maxWidth: 620, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            display: "inline-block", padding: "4px 14px", marginBottom: 16,
            border: `1px solid ${grade.color}40`, borderRadius: 99,
            fontSize: 11, letterSpacing: 3, textTransform: "uppercase",
            color: grade.color, fontFamily: "'Space Mono', monospace"
          }}>
            Quiz Complete
          </div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontSize: "clamp(28px, 6vw, 52px)",
            fontWeight: 800, color: "#fff", margin: "0 0 8px"
          }}>
            {grade.label}
          </h2>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 40, fontWeight: 700, color: grade.color }}>
            {score} <span style={{ fontSize: 18, color: "rgba(255,255,255,0.4)" }}>/ {total}</span>
          </div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
            {pct}% accuracy
          </div>
        </div>

        {/* Results list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 36 }}>
          {results.map((r, i) => {
            const q = QUIZ_DATA.questions[i];
            const isTimeout = r.selected === null;
            const isCorrect = r.selected === q.correct;
            return (
              <div key={i} style={{
                padding: "16px 20px", borderRadius: 12,
                background: "rgba(255,255,255,0.035)",
                border: `1px solid ${isCorrect ? "rgba(6,214,160,0.2)" : isTimeout ? "rgba(255,209,102,0.2)" : "rgba(255,77,109,0.2)"}`,
                display: "grid", gridTemplateColumns: "28px 1fr auto", gap: 12, alignItems: "start"
              }}>
                <span style={{
                  width: 28, height: 28, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center",
                  background: isCorrect ? "rgba(6,214,160,0.2)" : isTimeout ? "rgba(255,209,102,0.2)" : "rgba(255,77,109,0.2)",
                  fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700, flexShrink: 0,
                  color: isCorrect ? "#06d6a0" : isTimeout ? "#ffd166" : "#ff4d6d"
                }}>
                  {isCorrect ? "✓" : isTimeout ? "⏱" : "✗"}
                </span>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#e0e0e0", lineHeight: 1.4, marginBottom: 4 }}>
                    {q.question}
                  </div>
                  {!isCorrect && (
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                      Correct: <span style={{ color: "#06d6a0" }}>{q.options[q.correct]}</span>
                      {!isTimeout && r.selected !== null && (
                        <span> · Your answer: <span style={{ color: "#ff4d6d" }}>{q.options[r.selected]}</span></span>
                      )}
                    </div>
                  )}
                </div>
                <span style={{
                  fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700, flexShrink: 0,
                  color: isCorrect ? "#06d6a0" : "#ff4d6d"
                }}>
                  {isCorrect ? "+1" : isTimeout ? "−1" : "0"}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center" }}>
          <button
            onClick={onRetry}
            style={{
              padding: "14px 48px", borderRadius: 12, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #06d6a0, #0096c7)",
              color: "#000", fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 800,
              letterSpacing: 1, textTransform: "uppercase",
              boxShadow: "0 0 40px rgba(6,214,160,0.3)",
              transition: "transform 0.15s"
            }}
            onMouseEnter={e => e.target.style.transform = "scale(1.04)"}
            onMouseLeave={e => e.target.style.transform = "scale(1)"}
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [phase, setPhase] = useState("start"); // start | quiz | result
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState([]);

  const handleStart = () => {
    setPhase("quiz");
    setQIndex(0);
    setScore(0);
    setResults([]);
  };

  const handleAnswer = useCallback((selectedIdx) => {
    const q = QUIZ_DATA.questions[qIndex];
    const isCorrect = selectedIdx === q.correct;
    const newScore = score + (isCorrect ? 1 : 0);
    const newResults = [...results, { selected: selectedIdx }];
    setScore(newScore);
    setResults(newResults);
    if (qIndex + 1 >= QUIZ_DATA.questions.length) {
      setPhase("result");
    } else {
      setQIndex(qIndex + 1);
    }
  }, [qIndex, score, results]);

  const handleTimeout = useCallback(() => {
    const newScore = score - 1;
    const newResults = [...results, { selected: null }];
    setScore(newScore);
    setResults(newResults);
    if (qIndex + 1 >= QUIZ_DATA.questions.length) {
      setPhase("result");
    } else {
      setQIndex(qIndex + 1);
    }
  }, [qIndex, score, results]);

  // Google Fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap";
    document.head.appendChild(link);
    document.body.style.margin = "0";
    document.body.style.padding = "0";
  }, []);

  if (phase === "start") return <StartScreen onStart={handleStart} />;
  if (phase === "quiz") return (
    <QuestionCard
      key={qIndex}
      question={QUIZ_DATA.questions[qIndex]}
      qIndex={qIndex}
      total={QUIZ_DATA.questions.length}
      score={score}
      onAnswer={handleAnswer}
      onTimeout={handleTimeout}
    />
  );
  return <ResultScreen results={results} score={score} total={QUIZ_DATA.questions.length} onRetry={handleStart} />;
}