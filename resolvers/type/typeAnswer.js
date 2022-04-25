const { ApolloError } = require('apollo-server-express');
const graphqlFields = require('graphql-fields');

module.exports = {
     async question({ question_id }, _, { db }, info) {
         try {
           const attributes = db.question.intersection(graphqlFields(info));
     
           return await db.question.getByPK(question_id, { attributes });
         } catch (error) {
           console.log('question -> error', error);
           return new ApolloError('InternalServerError');
         }
       },
}