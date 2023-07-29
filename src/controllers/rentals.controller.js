import { db } from "../database/database.connection.js";
import dayjs from "dayjs";

export async function getRentals(req, res) {
  try {
    const rentals = await db.query(`
      SELECT rentals.*,
      rentals."rentDate", AS "rentDate"
      rentals."returnDate, AS "returnDate",
      customers."name" AS "customerName,
      games."name" as "gameName"
      FROM rentals
      JOIN customers ON rentals."customerId" = customers."id"
      JOIN games ON rentals."gameId" = games."id"`,
    );

    res.send(rentals.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function postRental(req, res) {
  const { customerId, gameId, daysRented } = req.body;

  try {
    const customer = await db.query(`SELECT * FROM customers WHERE id = $1`, [customerId]);
    if (!customer.rows[0].length) return res.status(400).send("User doesn't exist");

    const game = await db.query(`SELECT * FROM games WHERE id = $1`, [gameId]);
    if (!game.rows[0].length) return res.status(400).send("Game doesn't exist");

    const rentDate = dayjs().format('YYYY-MM-DD');
    const originalPrice = daysRented * game.pricePerDay;

    await db.query(`
      INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee"),
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [customerId, gameId, rentDate, daysRented, null, originalPrice, null]
    );

    } catch (err) {
      res.status(500).send(err.message);
  }
}

export async function checkoutRental(req, res) {
  
}

export async function deleteRental(req, res) {
  
}