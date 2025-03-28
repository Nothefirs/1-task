const request = require("supertest"); 
const mongoose = require("mongoose"); 
const app = require("../server"); 
const Task = require("../models/Task"); 
const { MongoMemoryServer } = require("mongodb-memory-server"); 
 
let mongoServer; 
 
beforeAll(async () => { 
    // Перевірка, чи є активне підключення 
    if (mongoose.connection.readyState === 0) { 
        mongoServer = await MongoMemoryServer.create(); 
        const mongoUri = mongoServer.getUri(); 
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true }); 
    } 
}); 
 
afterEach(async () => { 
    // Очищення задач після кожного тесту 
    await Task.deleteMany(); 
}); 
 
afterAll(async () => { 
    try { 
        await mongoose.disconnect(); 
        console.log("Mongoose disconnected"); 
        await mongoServer.stop(); 
        console.log("Mongo server stopped"); 
    } catch (error) { 
        console.error("Error stopping Mongo server:", error); 
    } 
}); 
 
describe("To-Do API", () => { 
    it("✅ Створює нову задачу", async () => { 
        const res = await request(app) 
            .post("/tasks") 
            .send({ name: "Тестова задача", description: "Опис тестової задачі" }); 
 
        expect(res.statusCode).toBe(200); 
        expect(res.body).toHaveProperty("_id"); 
        expect(res.body.name).toBe("Тестова задача"); 
    }); 
 
    it("✅ Отримує всі задачі", async () => { 
        // Збереження задачі в базу перед тестом 
        await new Task({ name: "Тестова задача", description: "Опис" }).save(); 
         
        const res = await request(app).get("/tasks"); 
 
        expect(res.statusCode).toBe(200); 
        expect(res.body.length).toBeGreaterThan(0); 
    }); 
 
    it("✅ Оновлює задачу", async () => { 
        // Спочатку зберігаємо задачу 
        const task = await new Task({ name: "Стара задача", description: "Старий опис" }).save(); 
         
        const res = await request(app) 
            .put(`/tasks/${task._id}`) 
            .send({ name: "Оновлена задача", description: "Оновлений опис" }); 
 
        expect(res.statusCode).toBe(200); 
        expect(res.body.name).toBe("Оновлена задача"); 
    }); 
 
    it("✅ Видаляє задачу", async () => { 
        // Спочатку зберігаємо задачу 
        const task = await new Task({ name: "Зайва задача" }).save(); 
         
        const res = await request(app).delete(`/tasks/${task._id}`); 
 
        expect(res.statusCode).toBe(200); 
 
        // Перевірка, чи задача була видалена 
        const deletedTask = await Task.findById(task._id); 
        expect(deletedTask).toBeNull(); 
    }); 
});
