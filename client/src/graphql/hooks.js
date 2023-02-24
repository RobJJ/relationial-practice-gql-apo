import { useMutation, useQuery } from "@apollo/client";
import { getAccessToken } from "../auth";
import {
  COMPANY_QUERY,
  CREATE_JOB_MUTATION,
  JOBS_QUERY,
  JOB_QUERY,
} from "./queries";
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
//
export function useCreateJob() {
  // the useMutation hook is a bit diff to useQuery.. it returns an arr..1st value is a func used to execute the mutation,, the 2nd is the result from the mutation... the useMutation hook doesnt call straight away and load data like the useQuery but rather it preapres the hook to be used when the func mutate is called! Our goal here is to replace the createJob function we wrote..
  // we using the result obj to get loading state.. which can be useful for disabling the submit button when the requeswt is being sent to the server.. nice!
  const [mutate, { loading, error }] = useMutation(CREATE_JOB_MUTATION);

  return {
    createJob: async (title, description) => {
      // result contains a data property, we destructure
      const {
        data: { job },
      } = await mutate({
        variables: { input: { title, description } },
        context: {
          headers: { Authorization: "Bearer " + getAccessToken() },
        },
        // the update func we wrote earlier
        update: (cache, { data: { job } }) => {
          cache.writeQuery({
            query: JOB_QUERY,
            variables: { id: job.id },
            data: { job },
          });
        },
      });
      return job;
    },
    loading,
    error: Boolean(error),
  };
}
