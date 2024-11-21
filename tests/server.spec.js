const request = require("supertest");
const server = require("../index");

describe("Operaciones CRUD de cafes", () => {
    // Test 1: GET /cafes
    it("Debería devolver un status 200 y un arreglo con al menos un objeto", async () => {
        const res = await request(server).get("/cafes");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    // Test 2: DELETE /cafes con id inexistente
    it("Debería devolver un status 404 si el id del café no existe", async () => {
        const res = await request(server).delete("/cafes/999").set("Authorization", "Bearer token");
        expect(res.status).toBe(404);
        expect(res.body.message).toBe("No se encontró ningún cafe con ese id");
    });

    // Test 3: POST /cafes
    it("Debería agregar un nuevo café y devolver un status 201", async () => {
        const newCafe = { id: 5, nombre: "Latte" };
        const res = await request(server).post("/cafes").send(newCafe);
        expect(res.status).toBe(201);
        expect(res.body).toEqual(
            expect.arrayContaining([expect.objectContaining(newCafe)])
        );
    });

    // Test 4: PUT /cafes con ids inconsistentes
    it("Debería devolver un status 400 si el id en los parámetros no coincide con el id del payload", async () => {
        const updatedCafe = { id: 6, nombre: "Flat White" };
        const res = await request(server).put("/cafes/5").send(updatedCafe);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
            "El id del parámetro no coincide con el id del café recibido"
        );
    });
});
