const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlController = require('../../controllers/sqlController');
const checkIfLoggedIn = require('../../middleware/auth/usersAuth');
const { jwtCode } = require('../../config');
const {
  userRegister,
  userLogin,
  userChangePassword,
} = require('../../middleware/validation/validationSchemas/usersSchema');
const validate = require('../../middleware/validation/validation');
const router = express.Router();

router.post('/register', validate(userRegister), async (req, res) => {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const data = await sqlController(`INSERT INTO users (name, password, email)
    VALUES(${mysql.escape(req.body.name)}, ${mysql.escape(hashedPassword)}, ${mysql.escape(req.body.email)})`);
    if (data.errno === 1062) {
      return res.status(400).send({
        msg: 'User already exists',
      });
    }
    if (!data.insertId) {
      return res.status(500).send({
        msg: 'something wrong with the server, please try again later',
      });
    }
    return res.send({ msg: 'registration completed' });
  } catch (err) {
    return res.status(500).send({ msg: 'something wrong with the server, please try again later' });
  }
});

router.post('/login', validate(userLogin), async (req, res) => {
  try {
    const data = await sqlController(
      `SELECT password, id 
      FROM users 
      WHERE email=${mysql.escape(req.body.email)} 
      LIMIT 1`,
    );
    const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);
    if (!checkPassword) {
      return res.status(400).send({ msg: 'wrong password' });
    }
    const token = jwt.sign(data[0].id, jwtCode);
    return res.send({ msg: 'Great success', token });
  } catch (err) {
    return res.status(500).send({ msg: 'something wrong with the server, please try again later' });
  }
});

router.post('/change-password', validate(userChangePassword), checkIfLoggedIn, async (req, res) => {
  try {
    const data = await sqlController(`SELECT password FROM users WHERE id=${req.user} LIMIT 1`);
    if (data.length === 0) {
      return res.status(500).send({
        msg: 'something wrong with the server, please try again later',
      });
    }
    const checkPassword = bcrypt.compareSync(req.body.oldPassword, data[0].password);
    if (!checkPassword) {
      return res.status(400).send({ msg: 'wrong old password' });
    }
    const data2 = await sqlController(
      `UPDATE users
       SET password=${mysql.escape(bcrypt.hashSync(req.body.newPassword, 10))}
       WHERE id=${req.user}`,
    );
    if (!data2.affectedRows) {
      return res.status(500).send({ msg: 'something wrong with the server, please try again later' });
    }
    return res.send({ msg: 'password successfully changed' });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      msg: 'something wrong with the server, please try again later',
    });
  }
});

module.exports = router;
