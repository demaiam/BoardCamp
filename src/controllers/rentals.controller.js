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
      JOIN games ON rentals."gameId" = games."id";`,
    );

    res.send(rentals.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function postRental(req, res) {
  const { customerId, gameId, daysRented } = req.body;

  try {
    const customer = await db.query(`SELECT * FROM customers WHERE id = $1;`, [customerId]);
    if (!customer.rows.length) return res.status(400).send("User doesn't exist");

    const game = await db.query(`SELECT * FROM games WHERE id = $1;`, [gameId]);
    if (!game.rows.length) return res.status(400).send("Game doesn't exist");

    await db.query(`
      INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee"),
      VALUES ($1, $2, $3, $4, $5, $6, $7);`,
      [customerId, gameId, dayjs().format('YYYY-MM-DD'), daysRented, null, daysRented * game.rows[0].pricePerDay, null]
    );

  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function endRental(req, res) {
  const { id } = req.params;

  try {
    const rental = await db.query(`SELECT * FROM rentals WHERE id = $1;`, [id]);
    if (!rental.rows.length) return res.status(404).send("Rental doesn't exist");
    if (rental.rows[0].returnDate != null) return res.status(400).send("Rental already finished");

    const game = await db.query(`SELECT "pricePerDay" FROM games WHERE id = $1;`, rental.rows[0].gameId);

    const returnDate = new Date();
    const rentDate = new Date(rental.rows[0].rentDate);

    const differenceInTime = returnDate.getTime() - rentDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    let aux = 0;
    if (differenceInDays - rental.rows[0].daysRented - 1 > 0)
      aux = (differenceInDays - rental.rows[0].daysRented - 1)  * game.rows[0].pricePerDay;

    const delayFee = aux;

    await db.query(`
      UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3;`,
      [dayjs().format('YYYY-MM-DD'), delayFee, id]
    );
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function deleteRental(req, res) {
  const { id } = req.params;

  try {
    const rental = await db.query(`SELECT * FROM rentals WHERE id = $1;`, [id]);
    if (!rental.rows.length) return res.status(404).send("Rental doesn't exist");
    if (rental.rows[0].returnDate == null) return res.status(400).send("Rental not finished yet");

    await db.query(`DELETE FROM rentals WHERE id = $1;`, [id]);

    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}