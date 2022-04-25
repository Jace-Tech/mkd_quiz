'use strict';
/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2020*/
/**
 * Server
 * @copyright 2020 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */
const app = require('./app');
app.set('port', process.env.NODE_PORT);
app.listen(app.get('port'), () => {
  const port = app.get('port');
  console.log('Node Server Running at http://127.0.0.1:' + port);
});
