// going to use graphql-request library here... which pretty much does a normal fetch() request but formats the code in graphql format for us!
import { request, gql } from "graphql-request";

const GRAPHQL_URL = "http://localhost:9000/graphql";

export async function getJobs() {
  // not exactly the same as the apollo-server, but mimicing
  const query = gql`
    query {
      jobs {
        id
        title
        company {
          name
        }
      }
    }
  `;
  const { jobs } = await request(GRAPHQL_URL, query);
  // this returns a promise which you are returning - so be mindful when consuming this
  return jobs;
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
  // can take a 3rd argument which are variables obj
  const { job } = await request(GRAPHQL_URL, query, variables);
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
  const { company } = await request(GRAPHQL_URL, query, variables);
  return company;
}
