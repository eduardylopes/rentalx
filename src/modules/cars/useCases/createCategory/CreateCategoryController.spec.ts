import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm/index";

let connection: Connection;

describe("Create Category Controller", () => {
  beforeEach(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);

    connection.query(
      `INSERT INTO USERS(id, name, email, password, "isAdmin", driver_license, created_at) 
        values('${id}', 'admin', 'admin@rentx.com.br', '${password}', true, 'XXXXX', 'now()')`
    );
  });

  it("should be able to create a new category", async () => {
    const responseToken = await request(app)
      .post("/sessions")
      .send({ email: "admin@rentx.com.br", password: "admin" });

    console.log(responseToken.body);

    const response = await request(app)
      .post("/categories")
      .send({ name: "Category Supertest", description: "Category Supertest" });

    expect(response.status).toBe(201);
  });
});
