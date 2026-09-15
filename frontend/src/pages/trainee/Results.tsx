import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Award } from 'lucide-react';
import { PageTitle } from '../../components/ui';

const PASS_THRESHOLD = 60;

export default function Results() {
  const [params] = useSearchParams();
  const score = Number(params.get('score') ?? 0);
  const certificateId = params.get('certificateId');
  const passed = score >= PASS_THRESHOLD;

  return (
    <>
      <PageTitle title="Assessment Result" subtitle="See how you performed." />

      <div
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '3rem 1rem', textAlign: 'center',
        }}
      >
        <div className={`result-circle${passed ? '' : ' fail'}`}>
          <div className="result-score">{score}%</div>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          {passed ? (
            <>
              <div
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '0.5rem', color: '#16a34a', fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem',
                }}
              >
                <CheckCircle size={26} /> Congratulations! You passed!
              </div>
              <p style={{ color: '#6b7280', maxWidth: 440, margin: '0 auto 1.5rem' }}>
                Great work! You scored {score}% which meets the passing threshold of {PASS_THRESHOLD}%.
              </p>
              {certificateId ? (
                <Link to={`/trainee/certificates`} className="btn">
                  <Award size={16} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle' }} />
                  View Certificate &rarr;
                </Link>
              ) : (
                <Link to="/trainee/learning" className="btn btn-outline">
                  Back to My Learning
                </Link>
              )}
            </>
          ) : (
            <>
              <div
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '0.5rem', color: '#dc2626', fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem',
                }}
              >
                <XCircle size={26} /> Not quite there yet
              </div>
              <p style={{ color: '#6b7280', maxWidth: 440, margin: '0 auto 1.5rem' }}>
                You scored {score}%. The passing threshold is {PASS_THRESHOLD}%. Review the course content and try again.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/trainee/learning" className="btn">
                  Review Content &amp; Try Again
                </Link>
                <Link to="/trainee/dashboard" className="btn btn-outline">
                  Back to Dashboard
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
