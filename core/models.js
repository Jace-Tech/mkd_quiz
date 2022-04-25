const { isInteger } = require("lodash");

module.exports = async function (Table) {
  Table._primaryKey = function () {
    return "id";
  };
  Table.getLast = async function (parameters) {
    let where = parameters;
    if (!where) {
      where = {};
    }
    for (const key in where) {
      const element = where[key];
      if (element == undefined || element == null) {
        delete where.key;
      }
    }
    result = await Table.findAll({
      limit: 1,
      where: where,
      order: [["id", "DESC"]],
    });
    return result[0];
  };
  Table.getAll = function (parameters, orderBy = Table._primaryKey(), direction = "ASC", orderAssociations, include = []) {
    let where = parameters;
    if (!where) {
      where = {};
    }
    for (const key in where) {
      const element = where[key];
      if (element == undefined || element == null) {
        delete where.key;
      }
    }

    let params = {
      where: where,
      include: include,
      distinct: true,
      order: [[orderBy, direction]],
    };

    if (Array.isArray(orderAssociations) && orderAssociations.length > 0) {
      orderAssociations.forEach(function (order) {
        params.order[0].unshift(order);
      });
    }
    return Table.findAll(params);
  };
  Table._count = function (parameters, include = []) {
    let where = parameters;
    if (!where) {
      where = {};
    }
    for (const key in where) {
      const element = where[key];
      if (element == undefined || element == null) {
        delete where.key;
      }
    }

    Table._customCountingConditions(where);

    return Table.count({
      where: where,
      include: include,
      distinct: true,
    });
  };

  Table.getPaginated = function (page, limit, parameters, orderBy, direction, orderAssociations = [], include = []) {
    let where = parameters;

    for (const key in where) {
      if (where.hasOwnProperty.call(where, key)) {
        const element = where[key];
        if (element.length || isInteger(element) || element === Object(element)) {
          where[key] = element;
        } else {
          delete where[key];
        }
      }
    }

    if (!page) {
      page = 0;
    }
    if (!limit) {
      limit = 10;
    }
    if (!where) {
      where = {};
    }
    if (!orderBy) {
      orderBy = Table._primaryKey();
    }
    if (!direction) {
      direction = "ASC";
    }

    for (const key in where) {
      const element = where[key];
      if (element == undefined || element == null) {
        delete where.key;
      }
    }
    let params = {
      where: where,
      offset: page * limit,
      limit: limit,
      include: include,
      order: [[orderBy, direction]],
      distinct: true,
    };
    if (Array.isArray(orderAssociations) && orderAssociations.length > 0) {
      orderAssociations.forEach(function (order) {
        params.order[0].unshift(order);
      });
    }
    return Table.findAll(params);
  };
  Table.getPaginatedV2 = function (page, limit, parameters, order, direction, include = []) {
    let where = parameters;

    for (const key in where) {
      if (where.hasOwnProperty.call(where, key)) {
        const element = where[key];
        if (element.length || isInteger(element) || element === Object(element)) {
          where[key] = element;
        } else {
          delete where[key];
        }
      }
    }

    if (!page) {
      page = 0;
    }
    if (!limit) {
      limit = 10;
    }
    if (!where) {
      where = {};
    }
    if (!order) {
      order = Table._primaryKey();
    }
    if (!direction) {
      direction = "ASC";
    }

    for (const key in where) {
      const element = where[key];
      if (element == undefined || element == null) {
        delete where.key;
      }
    }
    let params = {
      where: where,
      offset: page * limit,
      limit: limit,
      include: include,
      order: order,
      distinct: true,
    };
    return Table.findAll(params);
  };
  Table.getAllByStatus = function (status) {
    return Table.findAll({
      where: {
        status: status,
      },
    });
  };

  Table.getByField = function (field, value) {
    return Table.findOne({
      where: {
        [field]: value,
      },
      distinct: true,
    });
  };

  Table.getByPK = async function (id, options) {
    return await Table.findByPk(id, options);
  };

  Table.getByFields = function (parameters) {
    let where = parameters;
    if (!where) {
      where = {};
    }
    for (const key in where) {
      const element = where[key];
      if (element == undefined || element == null) {
        delete where.key;
      }
    }

    return Table.findOne({
      where: where,
    });
  };

  Table.getAllByKeyValue = async function (field, parameters) {
    let where = parameters;
    if (!where) {
      where = {};
    }
    let data = [];
    const results = await Table.findAll({
      where: where,
    });

    for (let i = 0; i < results.length; i++) {
      const element = results[i];
      let singleField = element[field];
      data.push({ [element.id]: singleField });
    }

    return data;
  };

  Table.insert = async function (data, { returnAllFields = false } = {}) {
    data = Table._preCreateProcessing(data);
    const insertedRow = await Table.create(Table._filterAllowKeys(data));
    if (returnAllFields === true) {
      return insertedRow;
    }
    if (insertedRow) {
      return insertedRow.id;
    }
    return false;
  };

  Table.batchInsert = async function (data) {
    const insertedRow = await Table.bulkCreate(data, { returning: true });

    if (insertedRow) {
      return insertedRow;
    }

    return false;
  };

  Table.edit = async function (data, id) {
    data = Table._postCreateProcessing(data);
    const updateRow = await Table.update(Table._filterAllowKeys(data), {
      where: {
        id: id,
      },
    }).catch((error) => {
      throw new Error(error);
    });

    return updateRow;
  };

  Table.editByField = async function (data, where) {
    data = Table._postCreateProcessing(data);

    const updateRow = await Table.update(Table._filterAllowKeys(data), {
      where,
    });

    return updateRow;
  };

  Table.delete = async function (id) {
    const updateRow = await Table.update(
      {
        status: 0,
      },
      {
        where: {
          id: id,
        },
      }
    );
    return updateRow;
  };

  Table.realDelete = async function (id) {
    return Table.destroy({
      where: {
        id: id,
      },
    });
  };

  Table.realDeleteByFields = async function (parameters, id) {
    let where = parameters;
    if (!where) {
      where = {
        id: id,
      };
    } else {
      where["id"] = id;
    }
    return Table.destroy({
      where: where,
    });
  };
  Table.realDeleteByUniqueField = async function (field, value) {
    let where = {};
    where[field] = value;
    return Table.destroy({
      where: where,
    });
  };
};
