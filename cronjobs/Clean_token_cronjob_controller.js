'use strict';
/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/

/**
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 */

const db = require('../models');

(async function tokenCronJob() {
  await db.query('UPDATE `token` SET status=0 WHERE `expire_at` < NOW();');
  await db.query('DELETE FROM `token` WHERE status=0;');
})();
