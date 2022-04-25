const { ApolloError } = require('apollo-server-express');
const graphqlFields = require('graphql-fields');

module.exports = {
     async profile({ profile_id }, _, { db }, info) {
         try {
           const attributes = db.profile.intersection(graphqlFields(info));
     
           return await db.profile.getByPK(profile_id, { attributes });
         } catch (error) {
           console.log('profile -> error', error);
           return new ApolloError('InternalServerError');
         }
       },async organization({ organization_id }, _, { db }, info) {
         try {
           const attributes = db.organization.intersection(graphqlFields(info));
     
           return await db.organization.getByPK(organization_id, { attributes });
         } catch (error) {
           console.log('organization -> error', error);
           return new ApolloError('InternalServerError');
         }
       },
}