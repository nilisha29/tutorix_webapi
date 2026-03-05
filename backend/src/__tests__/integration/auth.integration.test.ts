import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import crypto from "crypto";

const TEST_PREFIX = "authtest_";

function buildUserPayload() {
	const unique = `${TEST_PREFIX}${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
	return {
		fullName: "Test User",
		email: `${unique}@example.com`,
		username: unique,
		password: "password123",
		confirmPassword: "password123",
		phoneNumber: "9800000000",
		address: "Kathmandu",
	};
}

describe("Auth Integration", () => {
	afterAll(async () => {
		await UserModel.deleteMany({
			$or: [
				{ email: { $regex: `^${TEST_PREFIX}`, $options: "i" } },
				{ username: { $regex: `^${TEST_PREFIX}`, $options: "i" } },
			],
		});
	});

	it("registers a new user with valid payload", async () => {
		const payload = buildUserPayload();

		const res = await request(app).post("/api/auth/register").send(payload);

		expect(res.status).toBe(201);
		expect(res.body.success).toBe(true);
		expect(res.body.data).toBeDefined();
		expect(res.body.data.email).toBe(payload.email);
		expect(res.body.data.username).toBe(payload.username);
	});

	it("fails registration for duplicate email", async () => {
		const payload = buildUserPayload();

		await request(app).post("/api/auth/register").send(payload);
		const duplicateRes = await request(app).post("/api/auth/register").send({
			...payload,
			username: `${payload.username}_2`,
		});

		expect(duplicateRes.status).toBe(403);
		expect(duplicateRes.body.success).toBe(false);
	});

	it("logs in with valid credentials and returns token", async () => {
		const payload = buildUserPayload();

		await request(app).post("/api/auth/register").send(payload);

		const loginRes = await request(app).post("/api/auth/login").send({
			email: payload.email,
			password: payload.password,
		});

		expect(loginRes.status).toBe(200);
		expect(loginRes.body.success).toBe(true);
		expect(loginRes.body.token).toBeDefined();
		expect(typeof loginRes.body.token).toBe("string");
		expect(loginRes.body.data.email).toBe(payload.email);
	});

	it("fails login with invalid password", async () => {
		const payload = buildUserPayload();

		await request(app).post("/api/auth/register").send(payload);

		const loginRes = await request(app).post("/api/auth/login").send({
			email: payload.email,
			password: "wrongPassword",
		});

		expect(loginRes.status).toBe(401);
		expect(loginRes.body.success).toBe(false);
	});

	it("resets password and allows login only with new password", async () => {
		const payload = buildUserPayload();
		const newPassword = "newPassword123";

		await request(app).post("/api/auth/register").send(payload);

		const user = await UserModel.findOne({ email: payload.email });
		expect(user).toBeTruthy();

		const rawToken = crypto.randomBytes(32).toString("hex");
		const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

		await UserModel.findByIdAndUpdate(String(user!._id), {
			$set: {
				resetPasswordToken: hashedToken,
				resetPasswordExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
			},
		});

		const resetRes = await request(app).post("/api/auth/reset-password").send({
			token: rawToken,
			password: newPassword,
		});

		expect(resetRes.status).toBe(200);
		expect(resetRes.body.success).toBe(true);

		const oldLoginRes = await request(app).post("/api/auth/login").send({
			email: payload.email,
			password: payload.password,
		});
		expect(oldLoginRes.status).toBe(401);

		const newLoginRes = await request(app).post("/api/auth/login").send({
			email: payload.email,
			password: newPassword,
		});
		expect(newLoginRes.status).toBe(200);
		expect(newLoginRes.body.success).toBe(true);
	});

	it("changes password for authenticated user and invalidates old password", async () => {
		const payload = buildUserPayload();
		const nextPassword = "changedPass123";

		await request(app).post("/api/auth/register").send(payload);

		const loginRes = await request(app).post("/api/auth/login").send({
			email: payload.email,
			password: payload.password,
		});

		expect(loginRes.status).toBe(200);
		expect(loginRes.body.success).toBe(true);
		expect(typeof loginRes.body.token).toBe("string");

		const token = loginRes.body.token as string;

		const changeRes = await request(app)
			.put("/api/auth/change-password")
			.set("Authorization", `Bearer ${token}`)
			.send({
				currentPassword: payload.password,
				newPassword: nextPassword,
			});

		expect(changeRes.status).toBe(200);
		expect(changeRes.body.success).toBe(true);

		const oldLoginRes = await request(app).post("/api/auth/login").send({
			email: payload.email,
			password: payload.password,
		});
		expect(oldLoginRes.status).toBe(401);

		const newLoginRes = await request(app).post("/api/auth/login").send({
			email: payload.email,
			password: nextPassword,
		});
		expect(newLoginRes.status).toBe(200);
		expect(newLoginRes.body.success).toBe(true);
	});

	it("keeps admin role after update-profile", async () => {
		const payload = buildUserPayload();

		await request(app).post("/api/auth/register").send(payload);
		const created = await UserModel.findOne({ email: payload.email });
		expect(created).toBeTruthy();

		await UserModel.findByIdAndUpdate(String(created!._id), {
			$set: { role: "admin" },
		});

		const adminLoginRes = await request(app).post("/api/auth/login").send({
			email: payload.email,
			password: payload.password,
		});

		expect(adminLoginRes.status).toBe(200);
		expect(adminLoginRes.body.success).toBe(true);
		const token = adminLoginRes.body.token as string;

		const updateRes = await request(app)
			.put("/api/auth/update-profile")
			.set("Authorization", `Bearer ${token}`)
			.send({
				fullName: "Updated Admin",
				address: "Updated Address",
			});

		expect(updateRes.status).toBe(200);
		expect(updateRes.body.success).toBe(true);
		expect(updateRes.body.data.role).toBe("admin");

		const whoAmIRes = await request(app)
			.get("/api/auth/whoami")
			.set("Authorization", `Bearer ${token}`);

		expect(whoAmIRes.status).toBe(200);
		expect(whoAmIRes.body.success).toBe(true);
		expect(whoAmIRes.body.data.role).toBe("admin");
	});
});
