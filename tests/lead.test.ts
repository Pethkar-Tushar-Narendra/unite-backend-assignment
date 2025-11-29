import request from 'supertest';
import app from '../src/app';
import User from '../src/models/user.model';
import Lead from '../src/models/lead.model';

describe('Lead Management Tests', () => {
  let authToken: string;
  let userId: number;

  beforeAll(async () => {
    // Clean up
    await Lead.destroy({ where: {} });
    await User.destroy({ where: {} });

    // Create test user
    const user = await User.create({
      name: 'Test Agent',
      email: 'agent@test.com',
      password: await require('bcrypt').hash('Test@123', 10),
      role: 'agent',
    });
    userId = user.id;

    // Login to get token
    const loginResponse = await request(app).post('/api/auth/login').send({
      email: 'agent@test.com',
      password: 'Test@123',
    });

    authToken = loginResponse.body.accessToken;
  });

  afterAll(async () => {
    await Lead.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  describe('POST /api/leads', () => {
    it('should create a new lead successfully', async () => {
      const response = await request(app)
        .post('/api/leads')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'John Doe',
          phone: '+919876543210',
          email: 'john@example.com',
          status: 'new',
          source: 'website',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('lead');
      expect(response.body.lead.name).toBe('John Doe');
    });

    it('should fail with duplicate email', async () => {
      const response = await request(app)
        .post('/api/leads')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Jane Doe',
          phone: '+919876543211',
          email: 'john@example.com', // duplicate
          status: 'new',
          source: 'website',
        });

      expect(response.status).toBe(400);
    });

    it('should fail without authentication', async () => {
      const response = await request(app).post('/api/leads').send({
        name: 'Test Lead',
        phone: '+919876543212',
        email: 'test@example.com',
        status: 'new',
        source: 'website',
      });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/leads', () => {
    it('should fetch all leads', async () => {
      const response = await request(app)
        .get('/api/leads')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('leads');
      expect(Array.isArray(response.body.leads)).toBe(true);
    });

    it('should filter leads by status', async () => {
      const response = await request(app)
        .get('/api/leads?status=new')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.leads.every((l: any) => l.status === 'new')).toBe(
        true,
      );
    });
  });

  describe('PUT /api/leads/:id', () => {
    it('should update lead successfully', async () => {
      const lead = await Lead.create({
        name: 'Update Test',
        phone: '+919876543220',
        email: 'update@example.com',
        status: 'new',
        source: 'campaign',
      });

      const response = await request(app)
        .put(`/api/leads/${lead.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'contacted',
        });

      expect(response.status).toBe(200);
      expect(response.body.lead.status).toBe('contacted');
    });
  });

  describe('DELETE /api/leads/:id', () => {
    it('should delete lead successfully', async () => {
      const lead = await Lead.create({
        name: 'Delete Test',
        phone: '+919876543230',
        email: 'delete@example.com',
        status: 'new',
        source: 'campaign',
      });

      const response = await request(app)
        .delete(`/api/leads/${lead.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        'message',
        'Lead deleted successfully',
      );
    });
  });
});
