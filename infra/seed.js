// Seed script for Azure SQL (or local) using faker
const { ConnectionPool } = require("mssql");
const { faker } = require("@faker-js/faker");

async function main() {
  const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
  };

  const pool = new ConnectionPool(config);
  await pool.connect();

  console.log("Connected to database, seeding...");

  // insert services
  const serviceNames = [
    "General Checkup",
    "Blood Test",
    "X-Ray",
    "MRI",
    "Dental Cleaning",
    "Vaccination",
  ];
  for (let name of serviceNames) {
    await pool
      .request()
      .input("name", name)
      .input("desc", faker.lorem.sentence())
      .input("dur", faker.datatype.number({ min: 15, max: 120 }))
      .input("price", faker.finance.amount(50, 500, 2))
      .query(
        "INSERT INTO Services (Name, Description, DurationMinutes, Price) VALUES (@name, @desc, @dur, @price)",
      );
  }

  // insert sample patients
  for (let i = 0; i < 5; i++) {
    await pool
      .request()
      .input("first", faker.name.firstName())
      .input("last", faker.name.lastName())
      .input("email", faker.internet.email())
      .query(
        "INSERT INTO Patients (FirstName, LastName, Email) VALUES (@first, @last, @email)",
      );
  }

  console.log("Seed complete");
  await pool.close();
}

main().catch((err) => console.error(err));
