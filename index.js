const { gql, ApolloServer } = require("apollo-server");
const { Neo4jGraphQL } = require("@neo4j/graphql");
const neo4j = require("neo4j-driver");
require("dotenv").config();

const typeDefs = gql`

  type Kit {
    id: Int
    type: String
    name: String
    barcode: String
    barcodeType: String
    note: String
    samples: [Sample!]! @relationship(type: "SAMPLE", direction: OUT)
  }

  type Sample {
    id: Int
    type: String
    name: String
    assays: [Assay!]! @relationship(type: "ASSAY", direction: OUT)
  }
  type Assay {
    id: Int
    name: String
    results: [Result!]! @relationship(type: "RESULT", direction: OUT)

  }
  type Result {
    id: Int
    kingdom: String
    phylum: String
    class: String
    order: String
    family: String
    genus: String
    species: String
    similarity: String
    sequence: String
    comments: String
  }
`;

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

neoSchema.getSchema().then((schema) => {
    const server = new ApolloServer({
        schema: schema
    });

    server.listen().then(({ url }) => {
        console.log(`GraphQL server ready on ${url}`);
    });
});