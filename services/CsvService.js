const multer = require('multer');
const converter = require('json-2-csv');
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const db = require('./../models');
const upload_folder = path.resolve(__dirname, '../uploads');

module.exports = {
  /**
   * Import CSV file
   * @param {request} req
   * @param {response} res
   */
  csv_preview: function (req, res) {
    return new Promise((resolve, reject) => {
      const upload = multer({ dest: path.resolve(upload_folder) }).single('file');
      upload(req, res, async function (error) {
        if (error) {
          reject(error);
        }
        let data = [];
        fs.createReadStream(path.resolve(upload_folder, req.file.path))
          .pipe(csv.parse())
          .on('error', (error) => reject(error))
          .on('data', (row) => {
            data.push(row);
          })
          .on('end', (rowCount) => {
            fs.unlinkSync(path.resolve(upload_folder, req.file.path));
            console.log(`Parsed ${rowCount} rows`);
            resolve(data);
          });
      });
    });
  },
  csv_import: async function (req, res) {
    return new Promise((resolve, reject) => {
      const table = req.params.model;
      const upload = multer({ dest: path.resolve(upload_folder) }).single('file');
      let data = [];
      upload(req, res, async function (error) {
        if (error) {
          throw new Error(error);
        }
        fs.createReadStream(path.resolve(upload_folder, req.file.path))
          .pipe(csv.parse({ headers: true }))
          .on('error', (error) => reject(error))
          .on('data', (row) => {
            data.push(row);
          })
          .on('end', async (rowCount) => {
            fs.unlinkSync(path.resolve(upload_folder, req.file.path));
            console.log(`Parsed ${rowCount} rows`);
            await db[table].batchInsert(data).catch((error) => {
              console.log(error);
              reject(error);
            });
            resolve(data);
          });
      });
    });
  },
  /**
   * Export CSV file
   * @param {request} req
   * @param {response} res
   */
  csv_export: async function (req, res) {
    try {
      let fields = await db[req.table].getAll(req.where);
      fields = JSON.stringify(fields); // do this needed?

      const csv = await converter.json2csvAsync(fields);

      res.header('Content-Type', 'text/csv');
      res.attachment(req.table + '.csv');

      return res.send(csv);
    } catch (error) {
      console.log(error);
    }
  },
};
