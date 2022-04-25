"use strict";
/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * question Resolve Single
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
    const attributes = db.question.intersection(graphqlFields(info));
    
    return await db.question.getByPK(id);
  } catch (error) {
    console.log('single_question -> error', error);
    return new ApolloError('InternalServerError');
  }
};