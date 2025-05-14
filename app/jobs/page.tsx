import React from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui/button';

const JobsPage = () => {
  return (
    <div className="p-4">
      <h1>Jobs List</h1>
      <Link href="/jobs/create">
        <Button>Create Job</Button>
      </Link>
      {/* Add a list of jobs here */}
    </div>
  );
};

export default JobsPage;