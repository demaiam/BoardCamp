import { db } from "../database/database.connection.js";

export async function getCustomers(req, res) {
  try { 
    const customers = await db.query(`
      SELECT *, TO_CHAR(birthday, 'YYYY-MM-DD') AS birthday
        FROM customers;`
    );

    res.send(customers.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getCustomerById(req, res) {
  const { id } = req.params;

  try {
    const customer = await db.query(`
      SELECT *, TO_CHAR(birthday, 'YYYY-MM-DD') AS birthday
        FROM customers
        WHERE id = $1;`, [id]
    );

    if (!customer.rows.length) return res.status(404).send("Customer doesn't exist");
    
    res.send(customer.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function postCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;

  try { 
    const customer = await db.query(`
      SELECT * FROM customers
        WHERE cpf = $1;`, [cpf]
    );

    if (customer.rows.length) return res.status(409).send("CPF already belongs to another customer");

    await db.query(`
      INSERT INTO customers (name, phone, cpf, birthday)
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
    const customerCpf = await db.query(`
      SELECT * FROM customers 
        WHERE cpf = $1 AND id != $2;`, [cpf, id]
    );

    if (customerCpf.rows.length) return res.status(409).send("CPF already belongs to another customer");

    const customerId = await db.query(`
      SELECT * FROM customers 
        WHERE id = $1;`, [id]
    );

    if (!customerId.rows.length) return res.status(404).send("Customer doesn't exist");

    await db.query(`
      UPDATE customers 
        SET name = $1, phone = $2, cpf = $3, birthday = $4
        WHERE id = $5;`,
        [name, phone, cpf, birthday, id]
    );

    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}