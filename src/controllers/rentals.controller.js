import { db } from "../database/database.connection.js";
import dayjs from "dayjs";

export async function getRentals(req, res) {
  try { 

  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function postRental(req, res) {
  const { customerId, gameId, daysRented } = req.body;

  try {

    } catch (err) {
      res.status(500).send(err.message);
  }
}

export async function checkoutRental(req, res) {
  
}

export async function deleteRental(req, res) {
  
}