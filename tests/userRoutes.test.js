const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

beforeAll(async () => {
    // Перевірка, чи є активне підключення
    if (mongoose.connection.readyState === 0) {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }
});

afterEach(async () => {
    // Очищення задач після кожного тесту
    await User.deleteMany();
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

describe("User API", () => {
    // Тест для реєстрації користувача
    it("should register a new user", async () => {
        const response = await request(app).post("/users/").send({
            username: "testuser",
            email: "testuser@example.com",
            password: "testpassword",
        });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Користувача зареєстровано успішно");
    });

    // Тест для входу
    it("should login an existing user", async () => {
        // Спочатку створимо користувача
        await new User({
            username: "loginuser",
            email: "loginuser@example.com",
            password: await bcrypt.hash("loginpassword", 10),
        }).save();

        const response = await request(app).post("/users/login").send({
            email: "loginuser@example.com",
            password: "loginpassword",
        });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Вхід успішний");
        expect(response.body.user.username).toBe("loginuser");
    });

    // Тест для виходу з сесії
    it("should logout a user", async () => {
        // Створимо користувача для тесту
        const user = await new User({
            username: "logoutuser",
            email: "logoutuser@example.com",
            password: await bcrypt.hash("logoutpassword", 10),
        }).save();

        // Встановимо сесію
        const response = await request(app)
            .post("/users/logout")
            .set("Cookie", [`userId=${user._id}`]);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Вихід успішний");
    });

    // Тест для скидання пароля
    it("should reset the password", async () => {
        const user = await new User({
            username: "resetuser2",
            email: "resetuser2@example.com",
            password: await bcrypt.hash("resetpassword", 10),
        }).save();

        const token = crypto.randomBytes(32).toString("hex");

        // Оновимо користувача з тестовим токеном
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 година
        await user.save();

        const response = await request(app).post("/users/reset-password").send({
            token,
            newPassword: "newpassword123",
        });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Пароль успішно змінено");
    });
});
