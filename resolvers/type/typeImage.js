const { ApolloError } = require('apollo-server-express');
const graphqlFields = require('graphql-fields');

module.exports = {
     async user({ user_id }, _, { db }, info) {
         try {
           const attributes = db.user.intersection(graphqlFields(info));
     
           return await db.user.getByPK(user_id, { attributes });
         } catch (error) {
           console.log('user -> error', error);
           return new ApolloError('InternalServerError');
         }
       },
}