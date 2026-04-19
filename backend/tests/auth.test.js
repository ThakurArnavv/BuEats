/**
 * ╔══════════════════════════════════════════════════════════════════╗
 *    BuEats — Auth API Test Suite (Jest + Supertest)
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * Covers: Register, Login, Protected Routes, Edge Cases
 *
 * Run:  npm test
 */

import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../server.js';

const API = '/api/auth';

// ─── Helper: register + login and return { token, user } ───────────
const registerAndLogin = async (username = 'testuser', password = 'Test@1234', role = 'student') => {
  await request(app)
    .post(`${API}/register`)
    .send({ username, password, role });

  const res = await request(app)
    .post(`${API}/login`)
    .send({ username, password });

  return res.body; // { token, user }
};

// ════════════════════════════════════════════════════════════════════
// 1. SIGNUP / REGISTER API
// ════════════════════════════════════════════════════════════════════
describe('POST /api/auth/register', () => {
  // ── ✅ Successful registration ────────────────────────────────────
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post(`${API}/register`)
      .send({
        username: 'newstudent',
        password: 'Secure@123',
        role: 'student',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
  });

  it('should default role to "student" when not provided', async () => {
    const res = await request(app)
      .post(`${API}/register`)
      .send({ username: 'defaultrole', password: 'Password@1' });

    expect(res.status).toBe(201);
  });

  // ── ❌ Duplicate username ─────────────────────────────────────────
  it('should return 400 for duplicate username', async () => {
    // Register once
    await request(app)
      .post(`${API}/register`)
      .send({ username: 'dupuser', password: 'Pass@1234' });

    // Try to register the same username again
    const res = await request(app)
      .post(`${API}/register`)
      .send({ username: 'dupuser', password: 'Other@5678' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Username already exists');
  });

  // ── ❌ Missing fields ─────────────────────────────────────────────
  it('should return 400 when username is missing', async () => {
    const res = await request(app)
      .post(`${API}/register`)
      .send({ password: 'SomePass@1' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Username and password are required');
  });

  it('should return 400 when password is missing', async () => {
    const res = await request(app)
      .post(`${API}/register`)
      .send({ username: 'onlyuser' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Username and password are required');
  });

  it('should return 400 when body is completely empty', async () => {
    const res = await request(app)
      .post(`${API}/register`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

// ════════════════════════════════════════════════════════════════════
// 2. LOGIN API
// ════════════════════════════════════════════════════════════════════
describe('POST /api/auth/login', () => {
  // Seed a user before each login test
  beforeEach(async () => {
    await request(app)
      .post(`${API}/register`)
      .send({ username: 'loginuser', password: 'Correct@123', role: 'student' });
  });

  // ── ✅ Successful login ───────────────────────────────────────────
  it('should login with valid credentials and return a JWT', async () => {
    const res = await request(app)
      .post(`${API}/login`)
      .send({ username: 'loginuser', password: 'Correct@123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('username', 'loginuser');
    expect(res.body.user).toHaveProperty('role', 'student');

    // Verify the token is actually a valid JWT
    const decoded = jwt.verify(
      res.body.token,
      process.env.JWT_SECRET || 'fallback_secret',
    );
    expect(decoded).toHaveProperty('userId');
    expect(decoded).toHaveProperty('username', 'loginuser');
  });

  // ── ❌ Wrong password ─────────────────────────────────────────────
  it('should return 401 for incorrect password', async () => {
    const res = await request(app)
      .post(`${API}/login`)
      .send({ username: 'loginuser', password: 'WrongPass@1' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error', 'Invalid credentials');
  });

  // ── ❌ Non-existent user ──────────────────────────────────────────
  it('should return 401 if user does not exist', async () => {
    const res = await request(app)
      .post(`${API}/login`)
      .send({ username: 'ghostuser', password: 'NoAccount@1' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error', 'Invalid credentials');
  });

  // ── ❌ Empty fields ───────────────────────────────────────────────
  it('should return 400 when username is empty', async () => {
    const res = await request(app)
      .post(`${API}/login`)
      .send({ username: '', password: 'Something@1' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Username and password are required');
  });

  it('should return 400 when password is empty', async () => {
    const res = await request(app)
      .post(`${API}/login`)
      .send({ username: 'loginuser', password: '' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Username and password are required');
  });

  it('should return 400 when body is empty', async () => {
    const res = await request(app)
      .post(`${API}/login`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

// ════════════════════════════════════════════════════════════════════
// 3. PROTECTED ROUTES
// ════════════════════════════════════════════════════════════════════
describe('Protected Routes (/api/orders)', () => {
  // ── ❌ Access denied without token ────────────────────────────────
  it('should return 401 when no Authorization header is sent', async () => {
    const res = await request(app).get('/api/orders/student');

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error', 'No token provided');
  });

  it('should return 401 when Authorization header has no Bearer prefix', async () => {
    const res = await request(app)
      .get('/api/orders/student')
      .set('Authorization', 'some-random-string');

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error', 'No token provided');
  });

  it('should return 401 with an invalid/tampered token', async () => {
    const res = await request(app)
      .get('/api/orders/student')
      .set('Authorization', 'Bearer this.is.not.a.real.jwt');

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error', 'Invalid or expired token');
  });

  it('should return 401 with an expired token', async () => {
    // Craft a token that already expired
    const expiredToken = jwt.sign(
      { userId: '000', username: 'expired', role: 'student' },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '0s' }, // expires immediately
    );

    const res = await request(app)
      .get('/api/orders/student')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error', 'Invalid or expired token');
  });

  // ── ✅ Access granted with valid token ────────────────────────────
  it('should allow access with a valid token', async () => {
    const { token } = await registerAndLogin('protecteduser', 'Valid@1234', 'student');

    const res = await request(app)
      .get('/api/orders/student')
      .set('Authorization', `Bearer ${token}`);

    // Should NOT be 401 — the middleware let us through
    expect(res.status).not.toBe(401);
    // The orders endpoint returns an array (may be empty since fresh DB)
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

// ════════════════════════════════════════════════════════════════════
// 4. EDGE CASES
// ════════════════════════════════════════════════════════════════════
describe('Edge Cases', () => {
  // ── Username trimming & lowercasing (your User model does this) ──
  it('should trim and lowercase username on registration', async () => {
    await request(app)
      .post(`${API}/register`)
      .send({ username: '  CasedUser  ', password: 'Trimmed@123' });

    // Login with the normalised version
    const res = await request(app)
      .post(`${API}/login`)
      .send({ username: 'caseduser', password: 'Trimmed@123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  // ── Short password ─────────────────────────────────────────────── 
  // Note: Your current API does not enforce minimum length.
  // This test documents the CURRENT behaviour. If you add validation
  // later, update the expected status to 400.
  it('should allow (or reject) very short passwords — documents current behaviour', async () => {
    const res = await request(app)
      .post(`${API}/register`)
      .send({ username: 'shortpwduser', password: '1' });

    // Currently the API does NOT enforce min length, so it succeeds.
    // Change this to 400 once you add password validation middleware.
    expect(res.status).toBe(201);
  });

  // ── SQL-injection-like strings shouldn't crash the server ────────
  it('should handle special characters in username gracefully', async () => {
    const res = await request(app)
      .post(`${API}/register`)
      .send({ username: "'; DROP TABLE users; --", password: 'Injection@1' });

    // Should NOT return 500 (no unhandled crash)
    expect(res.status).not.toBe(500);
  });

  // ── Extremely long password ───────────────────────────────────────
  it('should handle very long passwords without crashing', async () => {
    const longPassword = 'A'.repeat(1000);
    const res = await request(app)
      .post(`${API}/register`)
      .send({ username: 'longpwduser', password: longPassword });

    // bcrypt has a 72-byte limit internally, but it should NOT crash
    expect(res.status).not.toBe(500);
  });

  // ── Content-Type edge case ────────────────────────────────────────
  it('should return an error when Content-Type is not JSON', async () => {
    const res = await request(app)
      .post(`${API}/register`)
      .type('text')
      .send('username=hello&password=world');

    // Express won't parse this, so fields will be missing
    expect(res.status).toBe(400);
  });

  // ── Duplicate registration race condition ─────────────────────────
  it('should not create two users with the same username in parallel', async () => {
    const payload = { username: 'raceuser', password: 'Race@1234' };

    const [res1, res2] = await Promise.all([
      request(app).post(`${API}/register`).send(payload),
      request(app).post(`${API}/register`).send(payload),
    ]);

    // Exactly one should succeed, the other should fail
    const statuses = [res1.status, res2.status].sort();
    expect(statuses).toContain(201);
    // The second could be 400 (your duplicate check) or 500 (unique index error)
    expect(statuses[1]).toBeGreaterThanOrEqual(400);
  });
});
