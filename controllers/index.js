const AdminUserController = require("./admin/Admin_user_controller");
const Admin_order_controller = require("./admin/Admin_order_controller");
const AdminQuizController = require("./admin/Admin_quiz_controller");
const AdminQuestionController = require("./admin/Admin_question_controller");
const AdminRulesController = require("./admin/Admin_rules_controller");
const AdminActivesController = require("./admin/Admin_actives_controller");
const AdminOutputVariablesController = require("./admin/Admin_output_variables_controller");
const AdminResultProfileController = require("./admin/Admin_result_profile_controller");
const AdminGetProfileSystem = require("./admin/getProfileSystem");
const PublicIndex = require("./public/index");
const AdminAnswerController = require("./admin/Admin_answer_controller");
const AdminDashboard = require("./admin/Dashboard");
const MemberDashboard = require("./member/Dashboard");
const getProducts = require("./shopify/getProducts");
const ShopifyWebhook = require("./shopify/webhook");
const KlaviyoController = require("./klaviyo/index");
module.exports = [
  KlaviyoController,
  Admin_order_controller,
  ShopifyWebhook,
  AdminResultProfileController,
  AdminGetProfileSystem,
  AdminUserController,
  AdminQuizController,
  AdminQuestionController,
  AdminRulesController,
  AdminActivesController,
  AdminOutputVariablesController,
  AdminAnswerController,
  AdminDashboard,
  MemberDashboard,
  PublicIndex,
  getProducts,
];
