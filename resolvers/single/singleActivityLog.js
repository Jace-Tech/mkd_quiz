"use strict";
/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * activity_log Resolve Single
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */


const { ApolloError } = require('apollo-server-express');
const graphqlFields = require('graphql-fields');

module.exports = async (_, {id}, {db}, info) => {
  try {
    const attributes = db.activity_log.intersection(graphqlFields(info));
    
    return await db.activity_log.getByPK(id);
  } catch (error) {
    console.log('single_activity_log -> error', error);
    return new ApolloError('InternalServerError');
  }
};