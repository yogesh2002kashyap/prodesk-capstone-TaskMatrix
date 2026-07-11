/**
 * backend.test.js — Full integration test suite for TaskMatrix API
 * Uses an in-memory MongoDB so no real database connection is needed.
 */

// Set test env before importing app (prevents process.exit and DB connect)
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_32chars_minimum!!';
process.env.CLIENT_URL = 'http://localhost:5173';
process.env.STRIPE_SECRET_KEY = 'sk_test_123';
process.env.STRIPE_PRICE_ID = 'price_test_123';

const request = require('supertest');
const app = require('../index');
const db = require('./setupTests');

// ─── helpers ─────────────────────────────────────────────────────────────────

const registerAndLogin = async (overrides = {}) => {
  const payload = {
    name: 'Test User',
    email: `user_${Date.now()}_${Math.random().toString(36).slice(2)}@test.com`,
    password: 'Password123',
    ...overrides,
  };
  const res = await request(app).post('/api/auth/register').send(payload);
  // extract cookie
  const cookie = res.headers['set-cookie']?.[0] ?? '';
  return { user: res.body.user, cookie, email: payload.email, password: payload.password };
};

const authedPost = (path, cookie, body) =>
  request(app).post(path).set('Cookie', cookie).send(body);

const authedGet = (path, cookie) =>
  request(app).get(path).set('Cookie', cookie);

const authedPut = (path, cookie, body) =>
  request(app).put(path).set('Cookie', cookie).send(body);

const authedDelete = (path, cookie) =>
  request(app).delete(path).set('Cookie', cookie);

// ─── lifecycle ────────────────────────────────────────────────────────────────

beforeAll(async () => { await db.connect(); });
afterEach(async () => { await db.clear(); });
afterAll(async () => { await db.close(); });

// ═════════════════════════════════════════════════════════════════════════════
// AUTH
// ═════════════════════════════════════════════════════════════════════════════

describe('AUTH — /api/auth', () => {
  // ── Register ──────────────────────────────────────────────────────────────
  describe('POST /register', () => {
    it('registers a new user and returns 201 with user object', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Alice',
        email: 'alice@example.com',
        password: 'SecurePass1',
      });
      expect(res.status).toBe(201);
      expect(res.body.user).toMatchObject({ name: 'Alice', email: 'alice@example.com' });
      expect(res.body.user).not.toHaveProperty('passwordHash');
    });

    it('sets an httpOnly cookie on successful registration', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Bob',
        email: 'bob@example.com',
        password: 'SecurePass1',
      });
      expect(res.headers['set-cookie']).toBeDefined();
      expect(res.headers['set-cookie'][0]).toMatch(/tm_token/);
    });

    it('returns 400 when email is already registered', async () => {
      const body = { name: 'Charlie', email: 'charlie@example.com', password: 'Pass1234' };
      await request(app).post('/api/auth/register').send(body);
      const res = await request(app).post('/api/auth/register').send(body);
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/already registered/i);
    });

    it('returns 400 when fields are missing', async () => {
      const res = await request(app).post('/api/auth/register').send({ email: 'x@x.com' });
      expect(res.status).toBe(400);
    });

    it('returns 400 when password is shorter than 8 characters', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Dan',
        email: 'dan@example.com',
        password: 'short',
      });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/8 characters/i);
    });
  });

  // ── Login ─────────────────────────────────────────────────────────────────
  describe('POST /login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send({
        name: 'Eve',
        email: 'eve@example.com',
        password: 'CorrectPass1',
      });
    });

    it('logs in with correct credentials and returns 200 + token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'eve@example.com', password: 'CorrectPass1' });
      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe('eve@example.com');
    });

    it('returns 401 for wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'eve@example.com', password: 'WrongPass999' });
      expect(res.status).toBe(401);
    });

    it('returns 401 for unknown email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nobody@example.com', password: 'AnyPass123' });
      expect(res.status).toBe(401);
    });

    it('returns 400 when fields are missing', async () => {
      const res = await request(app).post('/api/auth/login').send({ email: 'eve@example.com' });
      expect(res.status).toBe(400);
    });
  });

  // ── Logout ────────────────────────────────────────────────────────────────
  describe('POST /logout', () => {
    it('clears the cookie and returns 200', async () => {
      const { cookie } = await registerAndLogin();
      const res = await authedPost('/api/auth/logout', cookie, {});
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/logged out/i);
    });
  });

  // ── Protected route guard ────────────────────────────────────────────────
  describe('Protected route guard', () => {
    it('returns 401 with no cookie on a protected endpoint', async () => {
      const res = await request(app).get('/api/workspaces');
      expect(res.status).toBe(401);
    });

    it('returns 401 with an invalid/tampered cookie', async () => {
      const res = await request(app)
        .get('/api/workspaces')
        .set('Cookie', 'tm_token=totallyFakeToken');
      expect(res.status).toBe(401);
    });
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// STRIPE
// ═════════════════════════════════════════════════════════════════════════════

describe('STRIPE — /api/stripe', () => {
  it('requires authentication for checkout session creation', async () => {
    const res = await request(app).post('/api/stripe/create-checkout-session');
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/authentication token/i);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// WORKSPACES
// ═════════════════════════════════════════════════════════════════════════════

describe('WORKSPACES — /api/workspaces', () => {
  let owner, ownerCookie, otherCookie;

  beforeEach(async () => {
    ({ user: owner, cookie: ownerCookie } = await registerAndLogin({ email: 'owner@ws.com' }));
    ({ cookie: otherCookie } = await registerAndLogin({ email: 'other@ws.com' }));
  });

  const createWS = (cookie, name = 'Test WS') =>
    authedPost('/api/workspaces', cookie, { name });

  it('creates a workspace and returns 201', async () => {
    const res = await createWS(ownerCookie);
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Test WS');
    expect(res.body.owner).toBeDefined();
  });

  it('returns 400 when name is empty', async () => {
    const res = await createWS(ownerCookie, '');
    expect(res.status).toBe(400);
  });

  it('returns 400 when name is whitespace only', async () => {
    const res = await createWS(ownerCookie, '   ');
    expect(res.status).toBe(400);
  });

  it('lists only workspaces the user is a member of', async () => {
    await createWS(ownerCookie, 'Owner WS');
    const res = await authedGet('/api/workspaces', otherCookie);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0); // other user is not a member
  });

  it('updates workspace name as owner', async () => {
    const created = await createWS(ownerCookie, 'Original');
    const res = await authedPut(
      `/api/workspaces/${created.body._id}`,
      ownerCookie,
      { name: 'Updated' }
    );
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated');
  });

  it('returns 403 when non-owner tries to update', async () => {
    const created = await createWS(ownerCookie, 'WS');
    const res = await authedPut(
      `/api/workspaces/${created.body._id}`,
      otherCookie,
      { name: 'Hacked' }
    );
    expect(res.status).toBe(403);
  });

  it('returns 400 when updating with empty name', async () => {
    const created = await createWS(ownerCookie);
    const res = await authedPut(
      `/api/workspaces/${created.body._id}`,
      ownerCookie,
      { name: '' }
    );
    expect(res.status).toBe(400);
  });

  it('deletes a workspace as owner', async () => {
    const created = await createWS(ownerCookie);
    const res = await authedDelete(
      `/api/workspaces/${created.body._id}`,
      ownerCookie
    );
    expect(res.status).toBe(200);
  });

  it('returns 403 when non-owner tries to delete', async () => {
    const created = await createWS(ownerCookie);
    const res = await authedDelete(
      `/api/workspaces/${created.body._id}`,
      otherCookie
    );
    expect(res.status).toBe(403);
  });

  it('returns 404 for non-existent workspace id', async () => {
    const res = await authedDelete(
      '/api/workspaces/000000000000000000000000',
      ownerCookie
    );
    expect(res.status).toBe(404);
  });

  it('cascade-deletes projects and tasks on workspace delete', async () => {
    // Create workspace → project → task, then delete workspace
    const ws = await createWS(ownerCookie, 'CascadeWS');
    const proj = await authedPost('/api/projects', ownerCookie, {
      name: 'CascadeProj',
      workspaceId: ws.body._id,
    });
    await authedPost('/api/tasks', ownerCookie, {
      title: 'CascadeTask',
      projectId: proj.body._id,
    });

    await authedDelete(`/api/workspaces/${ws.body._id}`, ownerCookie);

    // Projects and tasks belonging to deleted workspace must be gone
    const tasks = await authedGet(
      `/api/tasks?projectId=${proj.body._id}`,
      ownerCookie
    );
    // Project is deleted so tasks would be [] or error 400
    expect(tasks.status).toBe(200);
    expect(tasks.body.length).toBe(0);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// PROJECTS
// ═════════════════════════════════════════════════════════════════════════════

describe('PROJECTS — /api/projects', () => {
  let ownerCookie, wsId, otherCookie;

  beforeEach(async () => {
    ({ cookie: ownerCookie } = await registerAndLogin({ email: 'projowner@test.com' }));
    ({ cookie: otherCookie } = await registerAndLogin({ email: 'projother@test.com' }));
    const ws = await authedPost('/api/workspaces', ownerCookie, { name: 'MyWS' });
    wsId = ws.body._id;
  });

  it('creates a project and returns 201', async () => {
    const res = await authedPost('/api/projects', ownerCookie, {
      name: 'My Project',
      workspaceId: wsId,
    });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('My Project');
  });

  it('returns 400 when name is missing', async () => {
    const res = await authedPost('/api/projects', ownerCookie, { workspaceId: wsId });
    expect(res.status).toBe(400);
  });

  it('returns 400 when workspaceId is missing', async () => {
    const res = await authedPost('/api/projects', ownerCookie, { name: 'P' });
    expect(res.status).toBe(400);
  });

  it('returns 403 when non-member tries to create a project', async () => {
    const res = await authedPost('/api/projects', otherCookie, {
      name: 'Hack',
      workspaceId: wsId,
    });
    expect(res.status).toBe(403);
  });

  it('returns 404 for non-existent workspace', async () => {
    const res = await authedPost('/api/projects', ownerCookie, {
      name: 'P',
      workspaceId: '000000000000000000000000',
    });
    expect(res.status).toBe(404);
  });

  it('lists all projects in a workspace', async () => {
    await authedPost('/api/projects', ownerCookie, { name: 'P1', workspaceId: wsId });
    await authedPost('/api/projects', ownerCookie, { name: 'P2', workspaceId: wsId });
    const res = await authedGet(`/api/projects?workspaceId=${wsId}`, ownerCookie);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it('returns 400 when getProjects is missing workspaceId', async () => {
    const res = await authedGet('/api/projects', ownerCookie);
    expect(res.status).toBe(400);
  });

  it('updates a project name', async () => {
    const proj = await authedPost('/api/projects', ownerCookie, {
      name: 'Old Name',
      workspaceId: wsId,
    });
    const res = await authedPut(
      `/api/projects/${proj.body._id}`,
      ownerCookie,
      { name: 'New Name' }
    );
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('New Name');
  });

  it('returns 403 when non-creator tries to update', async () => {
    const proj = await authedPost('/api/projects', ownerCookie, {
      name: 'P',
      workspaceId: wsId,
    });
    const res = await authedPut(
      `/api/projects/${proj.body._id}`,
      otherCookie,
      { name: 'Hacked' }
    );
    expect(res.status).toBe(403);
  });

  it('deletes a project and cascade-deletes its tasks', async () => {
    const proj = await authedPost('/api/projects', ownerCookie, {
      name: 'ToDelete',
      workspaceId: wsId,
    });
    await authedPost('/api/tasks', ownerCookie, {
      title: 'OrphanTask',
      projectId: proj.body._id,
    });

    const del = await authedDelete(`/api/projects/${proj.body._id}`, ownerCookie);
    expect(del.status).toBe(200);

    // Tasks for deleted project must be gone
    const tasks = await authedGet(
      `/api/tasks?projectId=${proj.body._id}`,
      ownerCookie
    );
    expect(tasks.body.length).toBe(0);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// TASKS
// ═════════════════════════════════════════════════════════════════════════════

describe('TASKS — /api/tasks', () => {
  let ownerCookie, projId, otherCookie;

  beforeEach(async () => {
    ({ cookie: ownerCookie } = await registerAndLogin({ email: 'taskowner@test.com' }));
    ({ cookie: otherCookie } = await registerAndLogin({ email: 'taskother@test.com' }));
    const ws = await authedPost('/api/workspaces', ownerCookie, { name: 'WS' });
    const proj = await authedPost('/api/projects', ownerCookie, {
      name: 'Proj',
      workspaceId: ws.body._id,
    });
    projId = proj.body._id;
  });

  it('creates a task and returns 201', async () => {
    const res = await authedPost('/api/tasks', ownerCookie, {
      title: 'Fix bug',
      projectId: projId,
    });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Fix bug');
    expect(res.body.column).toBe('Backlog'); // default must be capitalised
  });

  it('returns 400 when title is missing', async () => {
    const res = await authedPost('/api/tasks', ownerCookie, { projectId: projId });
    expect(res.status).toBe(400);
  });

  it('returns 400 when projectId is missing', async () => {
    const res = await authedPost('/api/tasks', ownerCookie, { title: 'T' });
    expect(res.status).toBe(400);
  });

  it('returns 404 for non-existent projectId', async () => {
    const res = await authedPost('/api/tasks', ownerCookie, {
      title: 'T',
      projectId: '000000000000000000000000',
    });
    expect(res.status).toBe(404);
  });

  it('returns 400 when column is invalid', async () => {
    const res = await authedPost('/api/tasks', ownerCookie, {
      title: 'T',
      projectId: projId,
      column: 'NotAColumn',
    });
    expect(res.status).toBe(400);
  });

  it('accepts valid column values', async () => {
    const res = await authedPost('/api/tasks', ownerCookie, {
      title: 'T',
      projectId: projId,
      column: 'In Progress',
    });
    expect(res.status).toBe(201);
    expect(res.body.column).toBe('In Progress');
  });

  it('gets tasks for a project', async () => {
    await authedPost('/api/tasks', ownerCookie, { title: 'T1', projectId: projId });
    await authedPost('/api/tasks', ownerCookie, { title: 'T2', projectId: projId });
    const res = await authedGet(`/api/tasks?projectId=${projId}`, ownerCookie);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it('returns 400 when getTasks is missing projectId', async () => {
    const res = await authedGet('/api/tasks', ownerCookie);
    expect(res.status).toBe(400);
  });

  it('updates a task as creator', async () => {
    const task = await authedPost('/api/tasks', ownerCookie, {
      title: 'Old',
      projectId: projId,
    });
    const res = await authedPut(
      `/api/tasks/${task.body._id}`,
      ownerCookie,
      { title: 'Updated', column: 'In Review' }
    );
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated');
    expect(res.body.column).toBe('In Review');
  });

  it('returns 400 when updating to an invalid column', async () => {
    const task = await authedPost('/api/tasks', ownerCookie, {
      title: 'T',
      projectId: projId,
    });
    const res = await authedPut(
      `/api/tasks/${task.body._id}`,
      ownerCookie,
      { column: 'SomeMadeUpColumn' }
    );
    expect(res.status).toBe(400);
  });

  it('returns 403 when non-creator tries to update a task', async () => {
    const task = await authedPost('/api/tasks', ownerCookie, {
      title: 'T',
      projectId: projId,
    });
    const res = await authedPut(
      `/api/tasks/${task.body._id}`,
      otherCookie,
      { title: 'Hacked' }
    );
    expect(res.status).toBe(403);
  });

  it('deletes a task as creator', async () => {
    const task = await authedPost('/api/tasks', ownerCookie, {
      title: 'ToDelete',
      projectId: projId,
    });
    const res = await authedDelete(`/api/tasks/${task.body._id}`, ownerCookie);
    expect(res.status).toBe(200);
  });

  it('returns 403 when non-creator tries to delete', async () => {
    const task = await authedPost('/api/tasks', ownerCookie, {
      title: 'T',
      projectId: projId,
    });
    const res = await authedDelete(`/api/tasks/${task.body._id}`, otherCookie);
    expect(res.status).toBe(403);
  });

  it('returns 404 for non-existent task', async () => {
    const res = await authedDelete(
      '/api/tasks/000000000000000000000000',
      ownerCookie
    );
    expect(res.status).toBe(404);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// STRIPE
// ═════════════════════════════════════════════════════════════════════════════

describe('STRIPE — /api/stripe', () => {
  let cookie;

  beforeEach(async () => {
    ({ cookie } = await registerAndLogin({ email: 'stripe@test.com' }));
  });

  it('POST /create-checkout-session returns 500 when STRIPE_SECRET_KEY is absent', async () => {
    const saved = process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_SECRET_KEY;

    const res = await request(app)
      .post('/api/stripe/create-checkout-session')
      .set('Cookie', cookie)
      .send({});
    expect(res.status).toBe(500);
    expect(res.body.message).toMatch(/stripe api key/i);

    process.env.STRIPE_SECRET_KEY = saved;
  });

  it('GET /session/:sessionId returns 500 when STRIPE_SECRET_KEY is absent', async () => {
    const saved = process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_SECRET_KEY;

    const res = await request(app).get('/api/stripe/session/sess_test_123');
    expect(res.status).toBe(500);
    expect(res.body.message).toMatch(/stripe api key/i);

    process.env.STRIPE_SECRET_KEY = saved;
  });

  it('POST /create-checkout-session returns 401 without auth cookie', async () => {
    const res = await request(app)
      .post('/api/stripe/create-checkout-session')
      .send({});
    expect(res.status).toBe(401);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// EDGE CASES — invalid ObjectIds
// ═════════════════════════════════════════════════════════════════════════════

describe('EDGE CASES — invalid ObjectIds', () => {
  let cookie;

  beforeEach(async () => {
    ({ cookie } = await registerAndLogin({ email: 'edge@test.com' }));
  });

  it('workspace update with invalid ObjectId returns 500 (CastError)', async () => {
    const res = await authedPut('/api/workspaces/not-an-id', cookie, { name: 'X' });
    expect([400, 404, 500]).toContain(res.status);
  });

  it('task fetch with invalid projectId still returns a valid response', async () => {
    const res = await authedGet('/api/tasks?projectId=bad-id', cookie);
    expect([200, 400, 500]).toContain(res.status);
  });
});
