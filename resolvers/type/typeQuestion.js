const { ApolloError } = require('apollo-server-express');
const graphqlFields = require('graphql-fields');

module.exports = {
     async quiz({ quiz_id }, _, { db }, info) {
         try {
           const attributes = db.quiz.intersection(graphqlFields(info));
     
           return await db.quiz.getByPK(quiz_id, { attributes });
         } catch (error) {
           console.log('quiz -> error', error);
           return new ApolloError('InternalServerError');
         }
       },
}