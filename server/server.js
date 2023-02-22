import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import { expressjwt } from "express-jwt";
import { readFile } from "fs/promises";
import jwt from "jsonwebtoken";
import { User } from "./db.js";
import { resolvers } from "./resolvers.js";

const PORT = 9000;
const JWT_SECRET = Buffer.from("Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt", "base64");

const app = express();
app.use(
  cors(),
  express.json(),
  expressjwt({
    algorithms: ["HS256"],
    credentialsRequired: false,
    secret: JWT_SECRET,
  })
);

// one api route exposed - which will handle it specifically.. any other routes will then be handled by the middleWare of apolloServer
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne((user) => user.email === email);
  if (user && user.password === password) {
    // json web token to auth users
    const token = jwt.sign({ sub: user.id }, JWT_SECRET);
    res.json({ token });
  } else {
    res.sendStatus(401);
  }
});

// read the file relative to where we are, and char encoding
const typeDefs = await readFile("./schema.graphql", "utf-8");
// create our apollo server and pass in the typeDefs & resolvers
const apolloServer = new ApolloServer({ typeDefs, resolvers });
await apolloServer.start();
// plug the apollo server into the express application
apolloServer.applyMiddleware({ app, path: "/graphql" });

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  // show graphql path
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
