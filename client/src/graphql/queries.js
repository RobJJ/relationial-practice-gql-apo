// going to use graphql-request library here... which pretty much does a normal fetch() request but formats the code in graphql format for us!
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
// removed this to use apollo-client instead
// import { request, gql } from "graphql-request";
import { getAccessToken } from "../auth";

const GRAPHQL_URL = "http://localhost:9000/graphql";

export const client = new ApolloClient({
  uri: GRAPHQL_URL,
  cache: new InMemoryCache(),
  // this is where you can set default policies for how the apollo-client uses the cache with requests.. or set individually at the function level below
  // defaultOptions: {
  //   query: {
  //     fetchPolicy: "network-only",
  //   },
  //   mutate: {
  //     fetchPolicy: "network-only",
  //   },
  //   watchQuery: {
  //     fetchPolicy: "network-only",
  //   },
  // },
});

const JOB_DETAIL_FRAGMENT = gql`
  fragment JobDetail on Job {
    id
    title
    company {
      id
      name
    }
    description
  }
`;

export const JOB_QUERY = gql`
  query JobQuery($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
  # can add a frament expression into the template literable.. its like inserting a varible
  ${JOB_DETAIL_FRAGMENT}
`;
export const JOBS_QUERY = gql`
  query JobsQuery {
    jobs {
      id
      title
      company {
        id
        name
      }
    }
  }
`;
export const COMPANY_QUERY = gql`
  query CompanyQuery($id: ID!) {
    company(id: $id) {
      name
      description
      jobs {
        id
        title
      }
    }
  }
`;
//
// not even using this function anymore because of the useQuery hook!!
export async function getJobs() {
  // not exactly the same as the apollo-server, but mimicing

  // APOLLO WAY
  // this result is the data, error, loading object...
  // could also destructure like this...
  // const { data: {jobs} } = await client.query({ query });
  // so when making an apollo request, we can also change how the default caching system works...by default its looking in its cache first and not making this call if it thinks nothing has changed.. lets change that! 2nd param for query: fetchPolicy.. this policy has diff options that can be used to specify how you want the requests to work
  const result = await client.query({
    query: JOBS_QUERY,
    fetchPolicy: "network-only",
  });
  return result.data.jobs;
  // OLD GRAPHQL WAY OF DOING THINGS
  // const { jobs } = await request(GRAPHQL_URL, query);
  // this returns a promise which you are returning - so be mindful when consuming this
  // return jobs;
  //   console.log(data); - this gives us jobs: array... so destructure
}
// function no longer needed because of useQuery and our custom hook!
export async function getJob(id) {
  // declared the JobQuery as reusable above..

  const variables = { id };
  // APOLLO RESPLACEMENT
  const {
    data: { job },
  } = await client.query({ query: JOB_QUERY, variables });
  // graphQL way -
  // can take a 3rd argument which are variables obj
  // const { job } = await request(GRAPHQL_URL, query, variables);
  return job;
  //   console.log(data); - this gives us jobs: array... so destructure
}
// not needed either anymore
export async function getCompany(id) {
  const query = gql`
    query CompanyQuery($id: ID!) {
      company(id: $id) {
        name
        description
        jobs {
          id
          title
        }
      }
    }
  `;
  const variables = { id };
  // Apollo replacement
  const {
    data: { company },
  } = await client.query({ query, variables });
  // graphql way
  // const { company } = await request(GRAPHQL_URL, query, variables);
  return company;
}

export async function createJob(input) {
  const mutation = gql`
    mutation CreateJobMutation($input: CreateJobInput!) {
      # can use an alias when doing a mutation - this way this name is returned rather than the strange name of the mutation 'createJob'
      job: createJob(input: $input) {
        ...JobDetail
      }
    }
    ${JOB_DETAIL_FRAGMENT}
  `;
  const variables = { input };
  // the alias field vs mutation name
  // this request func can have a 4th arugment which is the headers that we ned for JWT.. getAccessToken func -> localstorage look up
  // remember to leave space after "Bearer "
  // const headers = { Authorization: "Bearer " + getAccessToken() };
  // apollo way
  // set the headers with apollo by passing 3rd param context
  // this context object is different to the way we use on the server side.. this client side context is used to configure the http request vs the context that is passed to resolvers
  const context = {
    headers: { Authorization: "Bearer " + getAccessToken() },
  };
  // we added extra props to get returned when making this createJob request so we have the data needed for the new job component without having to send another request to the server.. so we can write this object to the cache that can then be used for the user when they are redirected to the new job listing without having to fetch more data!! we can write directly to cache by passing a 4th argument to the func below..the update function is fired *after* the mutation is successful!! it gets two arguments.. the cache obj and the result obj which is the same result from calling client.mutate
  const {
    data: { job },
  } = await client.mutate({
    mutation,
    variables,
    context,
    // manually creating cache data the same way as the getJob query - instead of making request to server..
    update: (cache, { data: { job } }) => {
      cache.writeQuery({
        query: JOB_QUERY,
        variables: { id: job.id },
        data: { job },
      });
    },
  });
  // graphql way.. changed query var above to mutation to be more clear
  // const { job } = await request(GRAPHQL_URL, query, variables, headers);
  return job;
}
