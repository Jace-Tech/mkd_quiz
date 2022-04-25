"use strict";
/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * image Resolve All
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */
const { ApolloError } = require('apollo-server-express');
const Sequelize = require('sequelize');
const { last } = require('lodash');
const graphqlFields = require('graphql-fields');

module.exports = async (_, { first, after }, { db, credential }, info) => {
  //Check Auth if user allowed
  try {
    const attributes = db.image.intersection(graphqlFields(info).edges.node);

    const options = {
      where: {},
      limit: first,
      attributes,
    };

    if (after) {
      options.where = {
        id: {
          [Sequelize.Op.gt]: after,
        },
      };
    }

    const { count, rows } = await db.image.findAndCountAll(options);
    
    const edges = rows.map((image) => ({
      cursor: image.id,
      node: image,
    }));

    const pageInfo = {
      endCursor: last(edges)?.cursor,
      hasNextPage: 0 < count - first,
    };

  return {
      edges,
      pageInfo,
    };

  } catch (error) {
    console.log('image -> error', error);
    return new ApolloError('InternalServerError');
  }
}
