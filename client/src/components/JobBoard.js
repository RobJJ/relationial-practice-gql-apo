import JobList from "./JobList";
// import { jobs } from "../fake-data";
import { getJobs, JOBS_QUERY } from "../graphql/queries";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
//
function JobBoard() {
  // useQuery now will handle the request and not the getJobs func you wrote before.. we can also pass a 2nd arg here to declare our fetchPolicy options!! same as old way
  const { data, loading, error } = useQuery(JOBS_QUERY, {
    fetchPolicy: "network-only",
  });
  // const [jobs, setJobs] = useState([]);
  // can create error state for handling
  // const [error, setError] = useState(false);
  //
  // useEffect(() => {
  //   // console.log("Hey im being called");
  //   getJobs()
  //     .then((jobs) => setJobs(jobs))
  //     .catch((err) => setError(true));
  // }, []);
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Something went wrong...</p>;
  }

  return (
    <div>
      <h1 className="title">Job Board</h1>
      <JobList jobs={data.jobs} />
    </div>
  );
}

export default JobBoard;
