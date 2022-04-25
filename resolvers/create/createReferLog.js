"use strict";
/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * refer_log Resolve Add
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */



const { ApolloError ,UserInputError} = require('apollo-server-express');
const { Validator } = require('node-input-validator');

module.exports = async (parent, args, {db}, info) => {
  try {
    const {    user_id,
   type } = args;
    const v = new Validator({    user_id: args.user_id,
   type: args.type}, {    user_id: "required|integer",
   type: "required|integer" });

    v.check().then(function (matched) {
      if (!matched) {
        Object.keys(v.errors).forEach((error) => {
          return new UserInputError(v.errors[error].message);
        });
      }
    });
    

    return await db.refer_log.insert({    user_id,
   type },{returnAllFields: true});
  } catch (error) {
    console.log('create_refer_log -> error', error);
    return new ApolloError('InternalServerError');
  }
};
