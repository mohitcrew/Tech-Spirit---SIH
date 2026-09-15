import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle } from 'lucide-react';
import { api, unwrap } from '../../services/api';
import { PageTitle, Loading, Empty, Alert } from '../../components/ui';

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  order: number;
  options: Option[];
}

interface AssessmentData {
  id: string;
  title: string;
  passingScore: number;
  questions: Question[];
}

export default function TakeAssessment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { data: assessment, isLoading } = useQuery<AssessmentData>({
    queryKey: ['assessment', id],
    queryFn: () => unwrap<AssessmentData>(api.get(`/assessments/${id}`)),
    enabled: !!id,
  });

  function handleSelect(questionId: string, optionId: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }

  async function handleSubmit() {
    if (!assessment) return;
    const unanswered = assessment.questions.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) {
      setError(`Please answer all ${assessment.questions.length} questions before submitting.`);
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        answers: Object.entries(answers).map(([questionId, optionId]) => ({ questionId, optionId })),
      };
      const res = await unwrap<any>(api.post(`/assessments/${id}/submit`, payload));
      const params = new URLSearchParams();
      params.set('score', String(res.score ?? 0));
      if (res.certificateId) params.set('certificateId', res.certificateId);
      navigate(`/trainee/results?${params.toString()}`);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) return <Loading />;
  if (!assessment) return <Empty>Assessment not found.</Empty>;

  const answered = Object.keys(answers).length;
  const total = assessment.questions.length;

  return (
    <>
      <PageTitle
        title={assessment.title}
        subtitle={`${total} question${total !== 1 ? 's' : ''} \u00b7 Passing score: ${assessment.passingScore}%`}
      />

      {/* Progress indicator */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="progress-bar" style={{ flex: 1 }}>
            <div
              className="progress-fill progress-fill-blue"
              style={{ width: `${total ? (answered / total) * 100 : 0}%` }}
            />
          </div>
          <span style={{ fontSize: '0.85rem', color: '#6b7280', whiteSpace: 'nowrap' }}>
            {answered} / {total} answered
          </span>
        </div>
      </div>

      {error && <Alert type="error" style={{ marginBottom: '1rem' }}>{error}</Alert>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
        {assessment.questions.map((q, qi) => (
          <div key={q.id} className="question-card">
            <div className="question-text">
              <span style={{ fontWeight: 700, color: '#1677a8', marginRight: '0.5rem' }}>Q{qi + 1}.</span>
              {q.text}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
              {q.options.map((opt) => (
                <label
                  key={opt.id}
                  className={`option-label${answers[q.id] === opt.id ? ' selected' : ''}`}
                >
                  <input
                    type="radio"
                    name={`q_${q.id}`}
                    value={opt.id}
                    checked={answers[q.id] === opt.id}
                    onChange={() => handleSelect(q.id, opt.id)}
                    style={{ marginRight: '0.6rem' }}
                  />
                  {opt.text}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        <button
          className="btn"
          onClick={handleSubmit}
          disabled={submitting}
          style={{ minWidth: 160 }}
        >
          {submitting ? 'Submittingâ€¦' : (
            <>
              <CheckCircle size={16} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle' }} />
              Submit Assessment
            </>
          )}
        </button>
      </div>
    </>
  );
}
