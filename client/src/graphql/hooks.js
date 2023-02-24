import { useQuery } from "@apollo/client";
import { COMPANY_QUERY, JOBS_QUERY, JOB_QUERY } from "./queries";
//
//
export function useJobs() {
  const { data, loading, error } = useQuery(JOBS_QUERY, {
    fetchPolicy: "network-only",
  });
  return {
    // option chaining. undefined or jobs array
    jobs: data?.jobs,
    // boolean
    loading,
    // an apollo error type, which we can convert
    error: Boolean(error),
  };
}
//
export function useJob(id) {
  // passing variables is this easy
  const { data, loading, error } = useQuery(JOB_QUERY, {
    variables: { id },
  });
  return {
    job: data?.job,
    loading,
    error: Boolean(error),
  };
}
//
export function useCompany(id) {
  const { data, loading, error } = useQuery(COMPANY_QUERY, {
    variables: { id },
  });
  return {
    company: data?.company,
    loading,
    error: Boolean(error),
  };
}
