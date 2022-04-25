/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * quiz Model
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */

const moment = require("moment");
const bcrypt = require('bcryptjs');
const {
    Op
} = require("sequelize");
const {
    intersection
} = require('lodash');
const coreModel = require('./../core/models');

module.exports = (sequelize, DataTypes) => {
    const Terminate = sequelize.define(
        "terminate", {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            message: DataTypes.TEXT,
            counter: DataTypes.INTEGER,
            created_at: DataTypes.DATEONLY,
            updated_at: DataTypes.DATE,
        }, {
            timestamps: true,
            freezeTableName: true,
            tableName: "terminate",
        }, {
            underscoredAll: false,
            underscored: false,
        }
    );

    coreModel.call(this, Terminate);

    Terminate._preCreateProcessing = function (data) {

        return data;
    };
    Terminate._postCreateProcessing = function (data) {

        return data;
    };
    Terminate._customCountingConditions = function (data) {

        return data;
    };

    Terminate._filterAllowKeys = function (data) {
        let cleanData = {};
        let allowedFields = Terminate.allowFields();
        allowedFields.push(Terminate._primaryKey());

        for (const key in data) {
            if (allowedFields.includes(key)) {
                cleanData[key] = data[key];
            }
        }
        return cleanData;
    };

    Terminate.timeDefaultMapping = function () {
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


    Terminate.allowFields = function () {
        return ["message", 'id', 'counter'];
    };

    Terminate.labels = function () {
        return ['ID', 'Message', 'Counter', ];
    };

    Terminate.validationRules = function () {
        return [
            ['id', 'ID', ''],
            ['message', 'Message', 'required'],
            ['counter', 'Counter', ''],
        ];
    };

    Terminate.validationEditRules = function () {
        return [
            ['id', 'ID', ''],
            ['message', 'Message', 'required'],
            ['counter', 'Counter', ''],
        ];
    };

    // ex
    Terminate.intersection = function (fields) {
        if (fields) {
            return intersection(
                [
                    'id', 'message', 'counter', 'created_at', 'updated_at',
                ],
                Object.keys(fields),
            );
        } else return [];
    };


    return Terminate;
};