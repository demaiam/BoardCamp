import { ObjectId } from "bson";
import { db } from "../database/database.connection.js";

export async function getCustomers(req, res) {
  try { 
    const customers = await db.query(`SELECT * FROM customers`);
    res.send(customers.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getCustomerById(req, res) {
  const { id } = req.params;

  try {
    const customer = await db.query(`SELECT * FROM customers WHERE id = $1;`, [id]);
    if (!customer) res.status(404).send("Customer doesn't exists");

    res.send(customer.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function postCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;

  try { 
    const customer = await db.quey(`SELECT * FROM customers WHERE cpf = $1;`, [cpf]);
    if (customer) res.status(409).send("Customer already exists");

    await db.query(`
      INSERT INTO customers (name, phone, cpf, number)
      VALUES ($1, $2, $3, $4);`,
      [name, phone, cpf, birthday]
    );

    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function updateCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;
  const { id } = req.params;

  try {
    await db.query(`
      UPDATE customers 
      SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5`,
      [name, phone, cpf, birthday, id]
    );
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}