import React from 'react';
import { useRouter } from 'next/router';

const CandidateDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="p-4">
      <h1>Candidate Detail for ID: {id}</h1>
      <p>AI-generated recommendation summary goes here.</p>
      <a href={`/data/candidates/${id}.pdf`} className="btn">Download CV</a>
    </div>
  );
};

export default CandidateDetailPage;