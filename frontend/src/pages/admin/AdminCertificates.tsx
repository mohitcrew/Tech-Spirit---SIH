import { useQuery } from '@tanstack/react-query';
import { Award, ExternalLink } from 'lucide-react';
import { api, unwrap } from '../../services/api';
import { Loading, PageTitle } from '../../components/ui';

interface Certificate {
  id: string;
  certificateCode: string;
  issuedAt: string;
  user?: { name: string; email: string };
  course?: { title: string };
}

export default function AdminCertificates() {
  const { data: certificates, isLoading } = useQuery({
    queryKey: ['admin-certificates'],
    queryFn: () => unwrap<Certificate[]>(api.get('/certificates')),
  });

  if (isLoading) return <Loading />;

  const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1';

  return (
    <>
      <PageTitle
        title="Certificates"
        subtitle={`${certificates?.length ?? 0} certificates issued`}
      />

      {!certificates?.length ? (
        <div className="card">
          <div className="state-box">
            <Award size={40} color="#94a3b8" />
            <p>No certificates issued yet.</p>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Certificate Code</th>
                  <th>User</th>
                  <th>Course</th>
                  <th>Issued Date</th>
                  <th>Status</th>
                  <th>Verify</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((cert) => (
                  <tr key={cert.id}>
                    <td>
                      <code
                        style={{
                          background: '#f1f5f9',
                          padding: '2px 8px',
                          borderRadius: 4,
                          fontSize: 12,
                          fontFamily: 'monospace',
                        }}
                      >
                        {cert.certificateCode}
                      </code>
                    </td>
                    <td>
                      <div>
                        <strong>{cert.user?.name ?? '—'}</strong>
                        {cert.user?.email && (
                          <div style={{ fontSize: 12, color: '#64748b' }}>{cert.user.email}</div>
                        )}
                      </div>
                    </td>
                    <td>{cert.course?.title ?? '—'}</td>
                    <td style={{ fontSize: 13 }}>
                      {new Date(cert.issuedAt).toLocaleDateString()}
                    </td>
                    <td>
                      <span className="badge badge-green">VALID</span>
                    </td>
                    <td>
                      <a
                        href={`${API_BASE}/certificates/${cert.id}/verify`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-outline"
                      >
                        <ExternalLink size={13} style={{ marginRight: 4 }} />
                        Verify
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
