import { useQuery } from '@tanstack/react-query';
import { Award } from 'lucide-react';
import { api, unwrap } from '../../services/api';
import { PageTitle, Loading, Empty } from '../../components/ui';

interface Certificate {
  id: string;
  code: string;
  issuedAt: string;
  enrollment?: {
    course: { title: string };
    user: { name: string };
  };
}

export default function Certificates() {
  const { data: certificates = [], isLoading } = useQuery<Certificate[]>({
    queryKey: ['certificates'],
    queryFn: () => unwrap<Certificate[]>(api.get('/certificates')),
  });

  if (isLoading) return <Loading />;

  return (
    <>
      <PageTitle
        title="My Certificates"
        subtitle="Certificates you have earned upon completing courses."
      />

      {certificates.length === 0 ? (
        <Empty icon={<Award size={40} color="#d1d5db" />}>
          No certificates yet. Complete a course to earn one!
        </Empty>
      ) : (
        <div className="grid-2">
          {certificates.map((cert) => (
            <div key={cert.id} className="cert-card">
              <div className="cert-seal">
                <Award size={32} color="#1677a8" />
              </div>
              <div className="cert-from">Capacity Connect LMS</div>
              <div className="cert-title">Certificate of Completion</div>
              <div className="cert-name">{cert.enrollment?.user?.name ?? 'â€”'}</div>
              <div className="cert-course">
                {cert.enrollment?.course?.title ?? 'Course'}
              </div>
              <div className="cert-meta">
                <span>Issued: {new Date(cert.issuedAt).toLocaleDateString()}</span>
                <span className="badge badge-green">VALID</span>
              </div>
              <div className="cert-code">ID: {cert.code}</div>
              <a
                href={`/api/v1/certificates/${cert.id}/verify`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
                style={{ marginTop: '0.75rem', width: '100%', textAlign: 'center', display: 'block' }}
              >
                Verify Certificate
              </a>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
