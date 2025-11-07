export default function QuestionEditor({ q, onUpdate, onRemove, onAddOption }) {
  return (
    <div className="card">
      <div className="row spread">
        <strong>Question ({q.type})</strong>
        <button className="btn btn-danger" onClick={onRemove}>Remove</button>
      </div>

      <label>Question text</label>
      <textarea className="input" value={q.text} onChange={e=>onUpdate({text:e.target.value})} />

      {q.type==="MCQ" && (
        <>
          {q.options.map((o,oi)=>(
            <label key={o.id} className="row-center">
              <input type="radio" checked={o.isCorrect}
                onChange={()=>onUpdate({options: q.options.map((oo,j)=> ({...oo, isCorrect: j===oi}))})}/>
              <input className="input" placeholder={`Option ${oi+1}`}
                     value={o.text}
                     onChange={e=>onUpdate({options: q.options.map((oo,j)=> j===oi? {...oo, text:e.target.value} : oo)})}/>
            </label>
          ))}
          <button className="btn btn-ghost" onClick={onAddOption}>+ Add Option</button>
        </>
      )}

      {q.type==="TRUE_FALSE" && (
        <div className="row">
          {["true","false"].map(v=>(
            <label key={v} className="row-center">
              <input type="radio" name={`tf${q.id}`} checked={String(q.correct)===v}
                     onChange={()=>onUpdate({correct: v==="true"})}/>
              <span>{v.toUpperCase()}</span>
            </label>
          ))}
        </div>
      )}

      {q.type==="SHORT_TEXT" && (
        <>
          <label>Correct answer (optional)</label>
          <input className="input" value={q.answerKey||""} onChange={e=>onUpdate({answerKey:e.target.value})}/>
        </>
      )}
    </div>
  );
}
