/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2020*/
/**
 * Pagination Service
 * @copyright 2020 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */
module.exports = function (page, numItems) {
  this.page = page ? Number(page) : 1;
  this.numItems = numItems ? Number(numItems) : 20;
  this.data = [];
  this.count = 0;
  this.numPages = 0;

  this.getItems = function () {
    return this.data;
  };

  this.getPage = function () {
    return this.page;
  };

  this.getCount = function () {
    return this.count;
  };

  this.setCount = function (count) {
    this.count = count;
  };

  this.getNumPages = function () {
    return this.numPages;
  };

  this.setItems = function (data) {
    if (data.length == 1 && !data[0].id) {
      this.count = 0;
      this.numPages = 1;
      this.data = [data[0]];
      return this;
    }
    this.data = data;
    this.numPages = this.count > 1 ? Math.ceil(this.count / this.numItems) : 1;

    this.data = this.data.map(function (transaction) {
      delete transaction.num;
      return transaction.toJSON();
    });

    return this;
  };

  this.getOffset = function () {
    return (this.page - 1) * this.numItems;
  };

  this.getLimit = function () {
    return this.numItems;
  };

  return this;
};
