const express = require('express');
const mysql = require('mysql2/promise');
const checkIfLoggedIn = require('../../middleware/auth/usersAuth');
const validate = require('../../middleware/validation/validation');
const { wineSchema } = require('../../middleware/validation/validationSchemas/wineSchema');
const sqlController = require('../../controllers/sqlController');
const router = express.Router();

router.get('/wines/:page/', async (req, res) => {
  try {
    const page = req.params.page;
    if (page <= 0) {
      return res.status(400).send({ msg: 'wrong data passed' });
    }
    const offset = (page - 1) * 3;
    const data = await sqlController(`SELECT * FROM wines LIMIT 3 OFFSET ${offset}`);
    if (data.length === 0) {
      return res.send({ msg: 'No data' });
    }
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ msg: 'something wrong with the server, please try again later' });
  }
});

router.post('/add-wine', validate(wineSchema), checkIfLoggedIn, async (req, res) => {
  try {
    const data = await sqlController(`INSERT INTO wines (title, year, region)
      VALUES(${mysql.escape(req.body.title)}, ${mysql.escape(req.body.year)}, ${mysql.escape(req.body.region)});`);
    if (data.errno === 1062) {
      return res.status(400).send({
        msg: 'wine is already in database',
      });
    }
    if (!data.insertId) {
      return res.status(500).send({
        msg: 'something wrong with the server, please try again later',
      });
    }
    return res.send({ msg: 'wine successfully added to database' });
  } catch (err) {
    return res.status(500).send({ msg: 'something wrong with the server, please try again later' });
  }
});

module.exports = router;
