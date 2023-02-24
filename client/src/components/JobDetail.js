import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useJob } from "../graphql/hooks";
import { getJob } from "../graphql/queries";
// import { jobs } from '../fake-data';

function JobDetail() {
  // const [job, setJob] = useState(null);
  const { jobId } = useParams();
  const { job, loading, error } = useJob(jobId);

  // useEffect(() => {
  //   // shorthand to setJeb with promise data then((job) => setJob(job))
  //   getJob(jobId).then(setJob);
  //   // if jobId changes,, func reruns
  // }, [jobId]);

  if (loading) {
    return <p>Loading....</p>;
  }
  // old hardcoded data
  // const job = jobs.find((job) => job.id === jobId);
  return (
    <div>
      <h1 className="title">{job.title}</h1>
      <h2 className="subtitle">
        <Link to={`/companies/${job.company.id}`}>{job.company.name}</Link>
      </h2>
      <div className="box">{job.description}</div>
    </div>
  );
}

export default JobDetail;
