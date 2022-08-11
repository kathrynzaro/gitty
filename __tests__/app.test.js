const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/services/github');


describe('oath routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('should redirect to the github oauth page upon login', async () => {
    const res = await request(app).get('/api/v1/github/login');

    expect(res.header.location).toMatch(
      /https:\/\/github.com\/login\/oauth\/authorize\?client_id=[\w\d]+&scope=user&redirect_uri=http:\/\/localhost:7890\/api\/v1\/github\/callback/i
    );
  });

  it('should login and redirect users to /api/v1/github/dashboard', async () => {
    const res = await request
      .agent(app)
      .get('/api/v1/github/callback?code=42')
      .redirects(1);
    
    expect(res.body).toEqual({
      id: expect.any(String),
      username: 'fake_github_user',
      email: 'not-real@example.com',
      avatar: expect.any(String),
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
  });

  it('#DELETE signs out a user', async () => {
    const agent = request.agent(app);
    await agent.get('/api/v1/github/callback?code=42').redirects(1);
    const res = await agent.delete('/api/v1/github');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: 'Signed out successfully!',
    });
  });

  it('#GET /posts authenticated users should see a list of posts', async () => {
    const agent = request.agent(app);
    await agent.get('/api/v1/github/callback?code=42').redirects(1);
    const res = await agent.get('/api/v1/posts');
    expect(res.status).toBe(200);
    expect(res.body[0]).toEqual({
      id: expect.any(String),
      content: expect.any(String),
      created_at: expect.any(String),
    });
  });

  it('#POST auth users should be able to add a post', async () => {
    const agent = request.agent(app);
    await agent.get('/api/v1/github/callback?code=42').redirects(1);
    const res = await agent.post('/api/v1/posts').send({
      content: 'i will not participate in your baseball team',
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      content: 'i will not participate in your baseball team',
      created_at: expect.any(String),
    });
  });

  afterAll(() => {
    pool.end();
  });
});
