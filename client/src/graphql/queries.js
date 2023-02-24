// going to use graphql-request library here... which pretty much does a normal fetch() request but formats the code in graphql format for us!
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
// removed gql from graphql
import { request } from "graphql-request";
import { getAccessToken } from "../auth";

const GRAPHQL_URL = "http://localhost:9000/graphql";

const client = new ApolloClient({
  uri: GRAPHQL_URL,
  cache: new InMemoryCache(),
});

export async function getJobs() {
  // not exactly the same as the apollo-server, but mimicing
  const query = gql`
    query JobsQuery {
      jobs {
        id
        title
        company {
          name
        }
      }
    }
  `;
  // APOLLO WAY
  // this result is the data, error, loading object...
  // could also destructure like this...
  // const { data: {jobs} } = await client.query({ query });
  const result = await client.query({ query });
  return result.data.jobs;
  // OLD GRAPHQL WAY OF DOING THINGS
  // const { jobs } = await request(GRAPHQL_URL, query);
  // this returns a promise which you are returning - so be mindful when consuming this
  // return jobs;
  //   console.log(data); - this gives us jobs: array... so destructure
}

export async function getJob(id) {
  // not exactly the same as the apollo-server, but mimicing
  const query = gql`
    query JobQuery($id: ID!) {
      job(id: $id) {
        id
        title
        company {
          id
          name
        }
        description
      }
    }
  `;
  const variables = { id };
  // APOLLO RESPLACEMENT
  const {
    data: { job },
  } = await client.query({ query, variables });
  // graphQL way -
  // can take a 3rd argument which are variables obj
  // const { job } = await request(GRAPHQL_URL, query, variables);
  return job;
  //   console.log(data); - this gives us jobs: array... so destructure
}

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
        id
      }
    }
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
  const {
    data: { job },
  } = await client.mutate({ mutation, variables, context });
  // graphql way.. changed query var above to mutation to be more clear
  // const { job } = await request(GRAPHQL_URL, query, variables, headers);
  return job;
}
