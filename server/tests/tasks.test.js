const request = require("supertest");
const app = require("../src/app");
const db = require("../src/models/db");
const jwt = require("jsonwebtoken");

jest.mock("../src/models/db");
process.env.JWT_SECRET = "test_secret";
const token = jwt.sign({ id: 1, email: "t@t.com", role: "member" }, "test_secret");

describe("Tasks API", () => {
  beforeEach(() => jest.clearAllMocks());

  test("GET /api/tasks returns list", async () => {
    db.query.mockResolvedValue({ rows: [{ id: 1, title: "Task A", status: "todo" }] });
    const res = await request(app).get("/api/tasks").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("POST /api/tasks creates task", async () => {
    db.query.mockResolvedValue({ rows: [{ id: 2, title: "New", status: "todo" }] });
    const res = await request(app).post("/api/tasks")
      .set("Authorization", `Bearer ${token}`).send({ title: "New" });
    expect(res.status).toBe(201);
  });

  test("POST /api/tasks rejects empty title", async () => {
    const res = await request(app).post("/api/tasks")
      .set("Authorization", `Bearer ${token}`).send({});
    expect(res.status).toBe(400);
  });

  test("GET /api/tasks without token is 401", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.status).toBe(401);
  });
});
