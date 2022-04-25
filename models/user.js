/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * user Model
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */

const moment = require("moment");
const bcrypt = require('bcryptjs');
const { Op } = require("sequelize");
const { intersection } = require('lodash');
const coreModel = require('./../core/models');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {

            id: {
              type: DataTypes.INTEGER,
              primaryKey: true,
              autoIncrement: true,
            },
          			role_id: DataTypes.INTEGER,
			profile_id: DataTypes.INTEGER,
			organization_id: DataTypes.INTEGER,
			first_name: DataTypes.STRING,
			last_name: DataTypes.STRING,
			phone: DataTypes.STRING,
			image: DataTypes.TEXT,
			refer: DataTypes.STRING,
			stripe_uid: DataTypes.STRING,
			paypal_uid: DataTypes.STRING,
			expire_at: DataTypes.DATEONLY,
			status: DataTypes.INTEGER,
created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "user",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  coreModel.call(this, User);

  User._preCreateProcessing = function (data) {
if(!data.image) data.image = "/image/profile.png";
if(!data.refer) data.refer = Math.round(Math.random() * 1000000000000,0);
if(!data.status) data.status = 1;
if(!data.verify) data.verify = 0;
if(!data.type)
		{
			data.type = 'n';
		}
    return data;
  };
  User._postCreateProcessing = function (data) {
if(data.password && data.password.length < 1)
		{
			delete data.password;
		}
if(data.image && data.image.length < 1)
		{
			delete data.image;
		}

    return data;
  };
  User._customCountingConditions = function (data) {

    return data;
  };

  User._filterAllowKeys = function (data) {
    let cleanData = {};
    let allowedFields = User.allowFields();
    allowedFields.push(User._primaryKey());

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key];
      }
    }
    return cleanData;
  };

  User.timeDefaultMapping = function () {
    let results = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j++) {
        let hour = i < 10 ? "0".i : i;
        let min = j < 10 ? "0".j : j;
        results[i * 60 + j] = `${hour}:${min}`;
      }
    }
    return results;
  };

  User.associate = function(models) { 	
User.belongsTo(models.role, {
                foreignKey: "role_id",
                as: "role",
                constraints: false,
              })	
User.hasOne(models.credential, {
                foreignKey: "user_id",
                as: "credential",
                constraints: false,
              })	
User.hasMany(models.refer_log, {
                foreignKey: "user_id",
                as: "refer_logs",
                constraints: false,
              })	
User.hasMany(models.member_operation, {
                foreignKey: "user_id",
                as: "member_operations",
                constraints: false,
              })	
User.hasMany(models.admin_operation, {
                foreignKey: "user_id",
                as: "admin_operations",
                constraints: false,
              })	
User.hasMany(models.token, {
                foreignKey: "user_id",
                as: "tokens",
                constraints: false,
              })	
User.hasMany(models.image, {
                foreignKey: "user_id",
                as: "images",
                constraints: false,
              }) };
  

        User.status_mapping = function (status) {
          const mapping = {"0":"Inactive","1":"Active","2":"Suspend"}
        
          if (arguments.length === 0) return mapping;
          else return mapping[status];
        };
        

  User.allowFields = function () {
    return ["user_id","user_id","user_id","user_id","user_id","user_id",'id','role_id','profile_id','organization_id','first_name','last_name','phone','image','refer','stripe_uid','paypal_uid','expire_at','status',];
  };

  User.labels = function () {
    return ['ID','Role ID','Profile ID','Organization ID','First Name','Last Name','Phone #','Image','Refer Code','Stripe ID','PayPal ID','Expire At','Status',];
  };

  User.validationRules = function () {
    return [
    	['id', 'ID', ''],
			['role_id', 'Role ID', ''],
			['profile_id', 'Profile ID', ''],
			['organization_id', 'Organization ID', ''],
			['first_name', 'First Name', 'required'],
			['last_name', 'Last Name', 'required'],
			['phone', 'Phone #', ''],
			['image', 'Image', ''],
			['refer', 'Refer Code', ''],
			['stripe_uid', 'Stripe ID', ''],
			['paypal_uid', 'PayPal ID', ''],
			['expire_at', 'Expire At', ''],
			['status', 'Status', 'required'],
		];
  };

  User.validationEditRules = function () {
    return [
    	['id', 'ID', ''],
			['role_id', 'Role ID', ''],
			['profile_id', 'Profile ID', ''],
			['organization_id', 'Organization ID', ''],
			['first_name', 'First Name', ''],
			['last_name', 'Last Name', ''],
			['phone', 'Phone #', ''],
			['image', 'Image', ''],
			['refer', 'Refer Code', ''],
			['stripe_uid', 'Stripe ID', ''],
			['paypal_uid', 'PayPal ID', ''],
			['expire_at', 'Expire At', ''],
			['status', 'Status', ''],
		];
  };


 	
User.get_role_paginated = function(db, where = {}, ...rest) {
        return User.getPaginated(...rest, [{
          model: db.role,          
          where: where,
          required: Object.keys(where).length > 0 ? true : false,       
          as: "role",   
        }])
      }	
	
User.get_credential_paginated = function(db, where = {}, ...rest) {
        return User.getPaginated(...rest, [{
          model: db.credential,          
          where: where,
          required: Object.keys(where).length > 0 ? true : false,       
          as: "credential",   
        }])
      }	
	
User.get_refer_log_paginated = function(db, where = {}, ...rest) {
        return User.getPaginated(...rest, [{
          model: db.refer_log,          
          where: where,
          required: Object.keys(where).length > 0 ? true : false,       
          as: "refer_logs",   
        }])
      }	
	
User.get_member_operation_paginated = function(db, where = {}, ...rest) {
        return User.getPaginated(...rest, [{
          model: db.member_operation,          
          where: where,
          required: Object.keys(where).length > 0 ? true : false,       
          as: "member_operations",   
        }])
      }	
	
User.get_admin_operation_paginated = function(db, where = {}, ...rest) {
        return User.getPaginated(...rest, [{
          model: db.admin_operation,          
          where: where,
          required: Object.keys(where).length > 0 ? true : false,       
          as: "admin_operations",   
        }])
      }	
	
User.get_token_paginated = function(db, where = {}, ...rest) {
        return User.getPaginated(...rest, [{
          model: db.token,          
          where: where,
          required: Object.keys(where).length > 0 ? true : false,       
          as: "tokens",   
        }])
      }	
	
User.get_image_paginated = function(db, where = {}, ...rest) {
        return User.getPaginated(...rest, [{
          model: db.image,          
          where: where,
          required: Object.keys(where).length > 0 ? true : false,       
          as: "images",   
        }])
      }	


 User.get_user_role = (id, db) => {
      return User.findByPk(id, 
        { 
          include: [
            { 
              model: db.role,
              required: false,  
              as: "role",   
            }
          ] 
        });
    };User.get_user_credential = (id, db) => {
      return User.findByPk(id, 
        { 
          include: [
            { 
              model: db.credential,
              required: false,  
              as: "credential",   
            }
          ] 
        });
    };User.get_user_refer_log = (id, db) => {
      return User.findByPk(id, 
        { 
          include: [
            { 
              model: db.refer_log,
              required: false,  
              as: "refer_logs",   
            }
          ] 
        });
    };User.get_user_member_operation = (id, db) => {
      return User.findByPk(id, 
        { 
          include: [
            { 
              model: db.member_operation,
              required: false,  
              as: "member_operations",   
            }
          ] 
        });
    };User.get_user_admin_operation = (id, db) => {
      return User.findByPk(id, 
        { 
          include: [
            { 
              model: db.admin_operation,
              required: false,  
              as: "admin_operations",   
            }
          ] 
        });
    };User.get_user_token = (id, db) => {
      return User.findByPk(id, 
        { 
          include: [
            { 
              model: db.token,
              required: false,  
              as: "tokens",   
            }
          ] 
        });
    };User.get_user_image = (id, db) => {
      return User.findByPk(id, 
        { 
          include: [
            { 
              model: db.image,
              required: false,  
              as: "images",   
            }
          ] 
        });
    };
 
  // ex
  User.intersection = function (fields) {
    if (fields) {
      return intersection(
        [
          'id','role_id','profile_id','organization_id','first_name','last_name','phone','image','refer','stripe_uid','paypal_uid','expire_at','status','created_at','updated_at',
        ],
        Object.keys(fields),
      );
    } else return [];
  };


  return User;
};
