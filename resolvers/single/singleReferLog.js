"use strict";
/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * refer_log Resolve Single
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
    const attributes = db.refer_log.intersection(graphqlFields(info));
    
    return await db.refer_log.getByPK(id);
  } catch (error) {
    console.log('single_refer_log -> error', error);
    return new ApolloError('InternalServerError');
  }
};