import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api, unwrap } from '../../services/api';
import { ClipboardCheck, AlertCircle } from 'lucide-react';

export default function Assessment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  const { data: assessment, isLoading } = useQuery({
    queryKey: ['assessment', id],
    queryFn: () => unwrap<any>(api.get(`/assessments/${id}`)),
  });

  const submit = useMutation({
    mutationFn: () =>
      unwrap<any>(api.post(`/assessments/${id}/submit`, {
        answers: Object.entries(answers).map(([questionId, optionId]) => ({ questionId, optionId })),
      })),
    onSuccess: (r) => {
      const score = r.attempt?.score ?? 0;
      const certId = r.certificate?.id ?? '';
      navigate(`/trainee/results?score=${score}&certificate=${certId}&passed=${r.attempt?.passed}`);
    },
    onError: (e: any) => {
      setError(e?.response?.data?.message || 'Submission failed. Please try again.');
    },
  });

  const handleSubmit = () => {
    if (!assessment) return;
    const unanswered = assessment.questions.filter((q: any) => !answers[q.id]);
    if (unanswered.length > 0) {
      setError(`Please answer all ${assessment.questions.length} questions before submitting.`);
      return;
    }
    setError('');
    submit.mutate();
  };

  const answered = Object.keys(answers).length;
  const total = assessment?.questions?.length ?? 0;

  if (isLoading) return <div className="state-box loading-pulse"><p>Loading assessment…</p></div>;
  if (!assessment) return <div className="state-box"><p>Assessment not found.</p></div>;

  return (
    <>
      <div style={{ marginBottom: 12 }}>
        <Link to="/trainee/learning" className="link" style={{ fontSize: 13 }}>← Back to My Learning</Link>
      </div>
      <div className="page-title">
        <div className="page-title-text">
          <h1>{assessment.title}</h1>
          <p>Passing score: {assessment.passingScore}% · {total} questions</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>Progress</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#123b5d' }}>{answered} / {total}</div>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: total > 0 ? `${(answered / total) * 100}%` : '0%' }} />
        </div>
        <div style={{ fontSize: 12, color: '#64748b', marginTop: 5 }}>{answered} of {total} questions answered</div>
      </div>

      {assessment.questions.map((q: any, i: number) => (
        <div key={q.id} className="question-card">
          <div className="question-text">{i + 1}. {q.text}</div>
          {q.options.map((opt: any) => (
            <label
              key={opt.id}
              className={`option-label${answers[q.id] === opt.id ? ' selected' : ''}`}
            >
              <input
                type="radio"
                name={q.id}
                value={opt.id}
                checked={answers[q.id] === opt.id}
                onChange={() => setAnswers({ ...answers, [q.id]: opt.id })}
              />
              {opt.text}
            </label>
          ))}
        </div>
      ))}

      {error && (
        <div className="alert alert-warning">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ fontSize: 14, color: '#64748b' }}>
          {answered < total
            ? `${total - answered} question${total - answered === 1 ? '' : 's'} remaining`
            : <span style={{ color: '#059669', fontWeight: 600 }}>✓ All questions answered — ready to submit!</span>
          }
        </div>
        <button
          className="btn"
          onClick={handleSubmit}
          disabled={submit.isPending}
          style={{ minWidth: 160, justifyContent: 'center' }}
        >
          <ClipboardCheck size={17} />
          {submit.isPending ? 'Submitting…' : 'Submit Assessment'}
        </button>
      </div>
    </>
  );
}
