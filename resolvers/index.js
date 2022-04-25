/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: {{{year}}}*/
/**
 * Resolve Index
 * @copyright {{{year}}} Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */

 const allUserResolver = require("./all/allUser");
 const singleUserResolver = require("./single/singleUser");
 const createUserResolver = require("./create/createUser");
 const updateUserResolver = require("./update/updateUser");
 const deleteUserResolver = require("./delete/deleteUser");
 const typeUserResolver = require("./type/typeUser");
 

 const allActivityLogResolver = require("./all/allActivityLog");
 const singleActivityLogResolver = require("./single/singleActivityLog");
 const createActivityLogResolver = require("./create/createActivityLog");
 const updateActivityLogResolver = require("./update/updateActivityLog");
 const deleteActivityLogResolver = require("./delete/deleteActivityLog");
 const typeActivityLogResolver = require("./type/typeActivityLog");
 

 const allReferLogResolver = require("./all/allReferLog");
 const singleReferLogResolver = require("./single/singleReferLog");
 const createReferLogResolver = require("./create/createReferLog");
 const updateReferLogResolver = require("./update/updateReferLog");
 const deleteReferLogResolver = require("./delete/deleteReferLog");
 const typeReferLogResolver = require("./type/typeReferLog");
 

 const allCredentialResolver = require("./all/allCredential");
 const singleCredentialResolver = require("./single/singleCredential");
 const createCredentialResolver = require("./create/createCredential");
 const updateCredentialResolver = require("./update/updateCredential");
 const deleteCredentialResolver = require("./delete/deleteCredential");
 const typeCredentialResolver = require("./type/typeCredential");
 

 const allImageResolver = require("./all/allImage");
 const singleImageResolver = require("./single/singleImage");
 const createImageResolver = require("./create/createImage");
 const updateImageResolver = require("./update/updateImage");
 const deleteImageResolver = require("./delete/deleteImage");
 const typeImageResolver = require("./type/typeImage");
 

 const allRuleResolver = require("./all/allRule");
 const singleRuleResolver = require("./single/singleRule");
 const createRuleResolver = require("./create/createRule");
 const updateRuleResolver = require("./update/updateRule");
 const deleteRuleResolver = require("./delete/deleteRule");
 const typeRuleResolver = require("./type/typeRule");
 

 const allQuizResolver = require("./all/allQuiz");
 const singleQuizResolver = require("./single/singleQuiz");
 const createQuizResolver = require("./create/createQuiz");
 const updateQuizResolver = require("./update/updateQuiz");
 const deleteQuizResolver = require("./delete/deleteQuiz");
 const typeQuizResolver = require("./type/typeQuiz");
 

 const allActiveResolver = require("./all/allActive");
 const singleActiveResolver = require("./single/singleActive");
 const createActiveResolver = require("./create/createActive");
 const updateActiveResolver = require("./update/updateActive");
 const deleteActiveResolver = require("./delete/deleteActive");
 const typeActiveResolver = require("./type/typeActive");
 

 const allOutputVariableResolver = require("./all/allOutputVariable");
 const singleOutputVariableResolver = require("./single/singleOutputVariable");
 const createOutputVariableResolver = require("./create/createOutputVariable");
 const updateOutputVariableResolver = require("./update/updateOutputVariable");
 const deleteOutputVariableResolver = require("./delete/deleteOutputVariable");
 const typeOutputVariableResolver = require("./type/typeOutputVariable");
 

 const allQuestionResolver = require("./all/allQuestion");
 const singleQuestionResolver = require("./single/singleQuestion");
 const createQuestionResolver = require("./create/createQuestion");
 const updateQuestionResolver = require("./update/updateQuestion");
 const deleteQuestionResolver = require("./delete/deleteQuestion");
 const typeQuestionResolver = require("./type/typeQuestion");
 

 const allAnswerResolver = require("./all/allAnswer");
 const singleAnswerResolver = require("./single/singleAnswer");
 const createAnswerResolver = require("./create/createAnswer");
 const updateAnswerResolver = require("./update/updateAnswer");
 const deleteAnswerResolver = require("./delete/deleteAnswer");
 const typeAnswerResolver = require("./type/typeAnswer");
 
module.exports = {

  Query: {
   Users: allUserResolver,
   User: singleUserResolver,
   ActivityLogs: allActivityLogResolver,
   ActivityLog: singleActivityLogResolver,
   ReferLogs: allReferLogResolver,
   ReferLog: singleReferLogResolver,
   Credentials: allCredentialResolver,
   Credential: singleCredentialResolver,
   Images: allImageResolver,
   Image: singleImageResolver,
   Rules: allRuleResolver,
   Rule: singleRuleResolver,
   Quizs: allQuizResolver,
   Quiz: singleQuizResolver,
   Actives: allActiveResolver,
   Active: singleActiveResolver,
   OutputVariables: allOutputVariableResolver,
   OutputVariable: singleOutputVariableResolver,
   Questions: allQuestionResolver,
   Question: singleQuestionResolver,
   Answers: allAnswerResolver,
   Answer: singleAnswerResolver
  },
  Mutation: {
   createUser: createUserResolver,
   updateUser: updateUserResolver,
   deleteUser: deleteUserResolver,
   createActivityLog: createActivityLogResolver,
   updateActivityLog: updateActivityLogResolver,
   deleteActivityLog: deleteActivityLogResolver,
   createReferLog: createReferLogResolver,
   updateReferLog: updateReferLogResolver,
   deleteReferLog: deleteReferLogResolver,
   createCredential: createCredentialResolver,
   updateCredential: updateCredentialResolver,
   deleteCredential: deleteCredentialResolver,
   createImage: createImageResolver,
   updateImage: updateImageResolver,
   deleteImage: deleteImageResolver,
   createRule: createRuleResolver,
   updateRule: updateRuleResolver,
   deleteRule: deleteRuleResolver,
   createQuiz: createQuizResolver,
   updateQuiz: updateQuizResolver,
   deleteQuiz: deleteQuizResolver,
   createActive: createActiveResolver,
   updateActive: updateActiveResolver,
   deleteActive: deleteActiveResolver,
   createOutputVariable: createOutputVariableResolver,
   updateOutputVariable: updateOutputVariableResolver,
   deleteOutputVariable: deleteOutputVariableResolver,
   createQuestion: createQuestionResolver,
   updateQuestion: updateQuestionResolver,
   deleteQuestion: deleteQuestionResolver,
   createAnswer: createAnswerResolver,
   updateAnswer: updateAnswerResolver,
   deleteAnswer: deleteAnswerResolver
},
     User: typeUserResolver,
   ActivityLog: typeActivityLogResolver,
   ReferLog: typeReferLogResolver,
   Credential: typeCredentialResolver,
   Image: typeImageResolver,
   Rule: typeRuleResolver,
   Quiz: typeQuizResolver,
   Active: typeActiveResolver,
   OutputVariable: typeOutputVariableResolver,
   Question: typeQuestionResolver,
   Answer: typeAnswerResolver
};
