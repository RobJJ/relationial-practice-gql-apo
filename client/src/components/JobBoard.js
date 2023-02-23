import JobList from "./JobList";
// import { jobs } from "../fake-data";
import { getJobs } from "../graphql/queries";
import { useEffect, useState } from "react";
//
function JobBoard() {
  const [jobs, setJobs] = useState([]);
  // can create error state for handling
  const [error, setError] = useState(false);
  //
  useEffect(() => {
    getJobs()
      .then((jobs) => setJobs(jobs))
      .catch((err) => setError(true));
  }, []);

  if (error) {
    return <p>Something went wrong...</p>;
  }

  return (
    <div>
      <h1 className="title">Job Board</h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default JobBoard;
