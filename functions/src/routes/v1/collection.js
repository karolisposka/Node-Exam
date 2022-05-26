const express = require('express');
const mysql = require('mysql2/promise');
const checkIfLoggedIn = require('../../middleware/auth/usersAuth');
const sqlController = require('../../controllers/sqlController');
const validate = require('../../middleware/validation/validation');
const addWineToCollectionSchema = require('../../middleware/validation/validationSchemas/collectionSchema');
const router = express.Router();

router.get('/my-wines', checkIfLoggedIn, async (req, res) => {
  try {
    const data = await sqlController(
      `SELECT collections.quantity, wines.title
       FROM collections
       LEFT JOIN wines ON wines.id = collections.wine_id
       WHERE user_id=${req.user}
      `,
    );
    if (data.length === 0) {
      return res.send({ msg: 'no data' });
    }
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ msg: 'something wrong with the server, please try again later' });
  }
});

router.post('/my-winesAdd', checkIfLoggedIn, validate(addWineToCollectionSchema), async (req, res) => {
  try {
    const data = await sqlController(
      `SELECT quantity 
       FROM collections 
       WHERE wine_id=${req.body.id} and user_id=${req.user} 
       LIMIT 1`,
    );
    if (data.length > 0) {
      const adjustedQuantity = data[0].quantity + req.body.quantity;
      if (adjustedQuantity < 0) {
        return res.send({ msg: 'invalid quanity' });
      }
      await sqlController(
        `UPDATE collections SET quantity=${adjustedQuantity} WHERE wine_id=${mysql.escape(req.body.id)} and user_id=${
          req.user
        }`,
      );
      return res.send({
        msg: `database updated current quantity is ${adjustedQuantity}`,
      });
    }
    if (req.body.quantity < 0) {
      return res.send({ msg: 'invalid quanity' });
    }
    const data2 = await sqlController(`INSERT INTO collections (wine_id, user_id, quantity)
      VALUES(${mysql.escape(req.body.id)}, ${mysql.escape(req.user)}, ${mysql.escape(req.body.quantity)})`);
    if (!data2.insertId) {
      return res.status(500).send({
        msg: 'something wrong with the server, please try again later',
      });
    }
    return res.send({ msg: 'Wine added to your collection' });
  } catch (err) {
    res.status(500).send({ msg: 'something wrong with the server, please try again later' });
  }
});

module.exports = router;
