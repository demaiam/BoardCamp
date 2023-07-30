import { db } from "../database/database.connection.js";
import dayjs from "dayjs";

export async function getRentals(req, res) {
  try {
    const rentals = await db.query(`
      SELECT rentals.*,
        TO_CHAR(rentals."rentDate", 'YYYY-MM-DD') AS "rentDate",
        TO_CHAR(rentals."returnDate", 'YYYY-MM-DD') AS "returnDate",
        customers."name" AS "customerName,
        games."name" AS "gameName"
        FROM rentals
        JOIN customers ON rentals."customerId" = customers."id"
        JOIN games ON rentals."gameId" = games."id";`
    );

    res.send(rentals.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function postRental(req, res) {
  const { customerId, gameId, daysRented } = req.body;

  try {
    if (daysRented <= 0) return res.status(400).send("Days not greater than zero");

    const customer = await db.query(`
      SELECT * FROM customers
        WHERE id = $1;`, [customerId]
    );  

    if (!customer.rows.length) return res.status(400).send("User doesn't exist");

    const game = await db.query(`
      SELECT * FROM games
        WHERE id = $1;`, [gameId]
    );

    if (!game.rows.length) return res.status(400).send("Game doesn't exist");
    
    const rentedGames = await db.query(`
      SELECT COUNT(*) AS "gameRented"
        FROM rentals
        WHERE "gameId" = $1
        AND "returnDate" = $2;`,
        [gameId, null]
    );

    if (game.rows[0].stockTotal - Number(rentedGames.rows[0].gameRented) <= 0) return res.status(400).send("Game not available");

    await db.query(`
      INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
        VALUES ($1, $2, $3, $4, $5, $6, $7);`,
        [customerId, gameId, dayjs().format('YYYY-MM-DD'), daysRented, null, daysRented * game.rows[0].pricePerDay, null]
    );

    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function endRental(req, res) {
  const { id } = req.params;

  try {
    const rental = await db.query(`
      SELECT * FROM rentals
        WHERE id = $1;`, [id]
    );

    if (!rental.rows.length) return res.status(404).send("Rental doesn't exist");
    if (rental.rows[0].returnDate != null) return res.status(400).send("Rental already finished");

    const game = await db.query(`
      SELECT "pricePerDay" FROM games
        WHERE id = $1;`, [rental.rows[0].gameId]
    );

    const returnDate = new Date();
    const rentDate = new Date(rental.rows[0].rentDate);

    const differenceInTime = returnDate.getTime() - rentDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    let delayFee = 0;
    if (differenceInDays - rental.rows[0].daysRented - 1 > 0)
      delayFee = (differenceInDays - rental.rows[0].daysRented - 1) * game.rows[0].pricePerDay;

    await db.query(`
      UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3;`,
      [dayjs().format('YYYY-MM-DD'), delayFee, id]
    );

    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function deleteRental(req, res) {
  const { id } = req.params;

  try {
    const rental = await db.query(`
      SELECT * FROM rentals 
        WHERE id = $1;`, [id]
    );

    if (!rental.rows.length) return res.status(404).send("Rental doesn't exist");
    if (rental.rows[0].returnDate == null) return res.status(400).send("Rental not finished");

    await db.query(`
      DELETE FROM rentals
        WHERE id = $1;`, [id]
    );

    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}