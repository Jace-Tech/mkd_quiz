"use strict";
/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * image Resolve Delete
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */

const { ApolloError } = require('apollo-server-express');

module.exports = async (parent, args, {db}, info) => {
  //Check Auth if user allowed
    try {
      
      return await db.image.realDelete(args.id);
    } catch (error) {
      console.log('delete_image -> error', error);
      return new ApolloError('InternalServerError');
    }
}