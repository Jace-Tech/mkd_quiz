"use strict";
/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * profile_header Resolve Add
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
    const {     } = args;
    const v = new Validator({    }, {     });

    v.check().then(function (matched) {
      if (!matched) {
        Object.keys(v.errors).forEach((error) => {
          return new UserInputError(v.errors[error].message);
        });
      }
    });
    

    return await db.profile_header.insert({     },{returnAllFields: true});
  } catch (error) {
    console.log('create_profile_header -> error', error);
    return new ApolloError('InternalServerError');
  }
};
