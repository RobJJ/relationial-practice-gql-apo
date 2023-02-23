// This is the area in which you write the functions that are responsilble for returning data! This data must conform to the structure of the Types that you have defined in your schema... meaning if the Type has a ! required property, you have to then return it in its resolver. The resolver functions here have to sign like a 'contract agreement' with the schema
// Your schema declaration of required fields is telling the server that it has to respond with this information,,, not that the client has to request it!! The client is free to decide what it wants!!

// These resolvers can also be async and this is helpful when it has to fetch data from a DB or potentially from another API!!
//
// need to .js extension if using import keyword for node.js
import { Job, Company } from "./db.js";

export const resolvers = {
  Query: {
    // can denote arg with _ to say unused,, can use root because we are at the top level Query
    job: (_root, { id }) => {
      // can destructure args to get the prop you want, in this case.. id
      return Job.findById(id);
    },
    jobs: async () => Job.findAll(),
    company: (_parent, args) => {
      return Company.findById(args.id);
    },
  },

  Mutation: {
    // destructure args based on what is passed through.. we can receiving that one input type
    createJob: (_root, { input }) => {
      return Job.create(input);
    },
    deleteJob: (_parent, { input }) => {
      return Job.delete(input.id);
    },
  },
  // this resolver is for the Job Type.. which is requested by Query Type - [Jobs!] (schema).. so just like we have a resolver for the Query - job field.. we can have a resolver for the Job - company field
  // the first argument for the Job type resolver - company field, is parent object,, which is the Job..
  Job: {
    company: (parent, args) => {
      // the parent is job
      //   console.log("resolving company for job: ", parent);
      return Company.findById(parent.companyId);
    },
  },
  // this is a way of creating assiosiation with the types... lecture 21 of graphql by example course for explanation
  // the parent in this situation will be the Company type
  Company: {
    // a func to resolve the jobs field of this type
    jobs: (parent, args) => {
      // the findAll func can take a filter func
      return Job.findAll((job) => job.companyId === parent.id);
    },
  },
};
