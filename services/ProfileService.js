const db = require('../models');

module.exports = {
  /**
   * Get user profile from user and credential table
   * @name profileService.get_profile
   * @param {string} user_id user id
   * @returns {Promise.<{email: string, password: string, first_name: string, last_name: string}>} profile fields
   */
  async get_profile(user_id) {
    try {
      const { email, password } = await db.credential.getByField({ user_id });
      const { first_name, last_name } = await db.user.getByPK(user_id);

      return {
        email,
        password,
        first_name,
        last_name,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  },
  /**
   * Edit user profile update user and credential tables
   * @param {string} user_id user id
   * @param {{email: string, password: string, first_name: string, last_name: string}} profile user profile
   * @returns {Promise.<{email: string, password: string, first_name: string, last_name: string}>} updated profile fields
   */
  async edit_profile(user_id, profile) {
    try {
      await db.credential.editByField(
        { email: profile.email, password: profile.password },
        { user_id },
      );
      await db.user.edit(
        { first_name: profile.first_name, last_name: profile.last_name },
        user_id,
      );

      return {
        email,
        password,
        first_name,
        last_name,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
