import React, { useState } from "react";
import { questions } from "./questions";
import { results } from "./results";
import "./main.css";

function App() {
  const [step, setStep] = useState("intro");
  const [gender, setGender] = useState("");
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  // 성별 선택
  const handleGender = (g) => {
    setGender(g);
    setStep("question");
  };

  // 답변 선택
  const handleAnswer = (traitArr) => {
    const newAnswers = [...answers, ...traitArr];
    setAnswers(newAnswers);
    if (newAnswers.length / traitArr.length === questions.length) {
      // 결과 계산
      const traitCount = {};
      newAnswers.forEach((t) => {
        traitCount[t] = (traitCount[t] || 0) + 1;
      });
      // 가장 많은 2~3개 trait 추출
      const sorted = Object.entries(traitCount)
        .sort((a, b) => b[1] - a[1])
        .map((x) => x[0]);
      // 결과 매칭 (성별도 함께 비교)
      const found = results.find(
        (r) => r.gender === gender && r.traits.every((t) => sorted.includes(t))
      );
      setResult(found || results.find((r) => r.gender === gender));
      setStep("result");
    }
  };

  // 다시하기
  const handleRestart = () => {
    setStep("intro");
    setGender("");
    setAnswers([]);
    setResult(null);
  };

  return (
    <div className="container">
      {step === "intro" && (
        <div className="intro">
          <h1>나는 과연 에겐녀? 테토녀? 아니면 반전캐?</h1>
          <p>
            숨겨왔던 내 속마음, 지금부터 들켜볼까요?
            <br />
            성별을 먼저 선택해주세요!
          </p>
          <button onClick={() => handleGender("여자")}>👩 나는 여자예요</button>
          <button onClick={() => handleGender("남자")}>👦 나는 남자예요</button>
        </div>
      )}
      {step === "question" && (
        <QuestionPage gender={gender} answers={answers} onAnswer={handleAnswer} />
      )}
      {step === "result" && result && (
        <ResultPage result={result} onRestart={handleRestart} />
      )}
    </div>
  );
}

function QuestionPage({ gender, answers, onAnswer }) {
  const qIdx = answers.length;
  const q = questions[qIdx];

  return (
    <div className="question">
      <h2>
        Q{qIdx + 1}. {q.question}
      </h2>
      <div className="options">
        {q.options.map((opt, i) => (
          <button key={i} onClick={() => onAnswer(opt.traits)}>
            {opt.text}
          </button>
        ))}
      </div>
      <div className="progress">
        {qIdx + 1} / {questions.length}
      </div>
    </div>
  );
}

function ResultPage({ result, onRestart }) {
  const handleShare = () => {
    navigator.clipboard.writeText(result.shareText);
    alert("공유 문구가 복사되었습니다! 친구에게 붙여넣기 해보세요.");
  };

  return (
    <div className="result">
      <h2>✨ {result.type} ✨</h2>
      <p>
        <b>겉모습:</b> {result.appearance}
        <br />
        <b>속마음:</b> {result.inside}
      </p>
      <div className="hashtags">
        {result.hashtags.map((tag, i) => (
          <span key={i}>{tag}</span>
        ))}
      </div>
      <p className="desc">{result.description}</p>
      <button onClick={handleShare}>📤 결과 공유하기</button>
      <button onClick={onRestart}>🔄 다시하기</button>
    </div>
  );
}

export default App;
