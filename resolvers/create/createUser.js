"use strict";
/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * user Resolve Add
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
    const {    role_id,
   profile_id,
   organization_id,
   first_name,
   last_name,
   phone,
   image,
   refer,
   stripe_uid,
   paypal_uid,
   expire_at,
   status } = args;
    const v = new Validator({    first_name: args.first_name,
   last_name: args.last_name,
   status: args.status}, {    first_name: "required",
   last_name: "required",
   status: "required" });

    v.check().then(function (matched) {
      if (!matched) {
        Object.keys(v.errors).forEach((error) => {
          return new UserInputError(v.errors[error].message);
        });
      }
    });
    

    return await db.user.insert({    role_id,
   profile_id,
   organization_id,
   first_name,
   last_name,
   phone,
   image,
   refer,
   stripe_uid,
   paypal_uid,
   expire_at,
   status },{returnAllFields: true});
  } catch (error) {
    console.log('create_user -> error', error);
    return new ApolloError('InternalServerError');
  }
};
