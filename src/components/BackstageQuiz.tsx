import { useState } from "react";
import { ArrowRight, Check, Gamepad2, RotateCcw, Trophy, X } from "lucide-react";

const questions = [
  { question: "Who goes by ‘The Dentist’?", options: ["Ginga Jay", "Darren Stewart", "Passive", "Reason"], answer: 1, fact: "Darren ‘The Dentist’ Stewart brings his MMA experience to the Gzone." },
  { question: "What is Gzone’s first season called?", options: ["First Contact", "No Mercy", "Most Wanted", "The Takeover"], answer: 2, fact: "Season 1 is Most Wanted." },
  { question: "Where does the Gzone call home?", options: ["Peacock Gymnasium", "Wembley Arena", "Brixton Academy", "York Hall"], answer: 0, fact: "The Gzone takes over Peacock Gymnasium in Canning Town." },
  { question: "Who keeps the decks moving?", options: ["N.STUDIOS", "Sonic", "ScientificBrad", "Most Wanted 2"], answer: 3, fact: "DJ Wayne Y.G. and DJ K.J. are Most Wanted 2, the official DJs." },
  { question: "Who is the Gzone’s main host?", options: ["Ginga Jay", "TR", "Icy Jones", "Teeski"], answer: 0, fact: "Ginga Jay is the main voice of the Gzone." },
];

export default function BackstageQuiz() {
  const [round, setRound] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);
  const finished = round === questions.length;
  const question = questions[round];

  function choose(index: number) {
    if (choice !== null) return;
    setChoice(index);
    if (index === question.answer) setScore(value => value + 1);
  }

  function restart() {
    setRound(0);
    setChoice(null);
    setScore(0);
    setStarted(true);
  }

  return (
    <section className="backstage-quiz" aria-labelledby="backstage-quiz-title">
      <div className="backstage-section-kicker"><Gamepad2 size={16} /> THE GAME ROOM</div>
      <h2 id="backstage-quiz-title">KNOW YOUR GZONE?</h2>
      {!started ? <>
        <p>Five questions. One shot at bragging rights. Let’s see how closely you’ve been watching.</p>
        <button className="backstage-primary" onClick={() => setStarted(true)}>LET’S PLAY <ArrowRight size={18} /></button>
      </> : finished ? <div className="backstage-quiz-result" aria-live="polite">
        <Trophy size={40} />
        <strong>{score}<span> / {questions.length}</span></strong>
        <h3>{score === 5 ? "GZONE CERTIFIED." : score >= 3 ? "YOU KNOW YOUR STUFF." : "TIME TO HIT THE ARCHIVE."}</h3>
        <p>{score === 5 ? "Full marks. Go on, talk your talk." : "There’s always another round. Come back swinging."}</p>
        <button className="backstage-secondary" onClick={restart}><RotateCcw size={16} /> PLAY AGAIN</button>
      </div> : <>
        <div className="backstage-quiz-progress"><span>ROUND {round + 1} / {questions.length}</span><span>{score} CORRECT</span></div>
        <div className="backstage-progress-track" aria-hidden="true"><div style={{ width: `${(round / questions.length) * 100}%` }} /></div>
        <h3 className="backstage-question">{question.question}</h3>
        <div className="backstage-answers">
          {question.options.map((option, index) => <button key={option} disabled={choice !== null}
            className={choice !== null && index === question.answer ? "is-correct" : choice === index ? "is-wrong" : ""}
            onClick={() => choose(index)}>
            <span>{String.fromCharCode(65 + index)}</span>{option}
            {choice !== null && index === question.answer ? <Check size={18} /> : choice === index ? <X size={18} /> : null}
          </button>)}
        </div>
        {choice !== null && <div className="backstage-answer-feedback" aria-live="polite">
          <p>{choice === question.answer ? "That’s the one! " : "Not this round. "}{question.fact}</p>
          <button className="backstage-primary" onClick={() => { setRound(value => value + 1); setChoice(null); }}>{round === questions.length - 1 ? "SEE MY SCORE" : "NEXT ROUND"}<ArrowRight size={17} /></button>
        </div>}
      </>}
    </section>
  );
}
