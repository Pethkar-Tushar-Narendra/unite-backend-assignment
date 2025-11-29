import request from 'supertest';
import app from '../src/app';
import User from '../src/models/user.model';
import Lead from '../src/models/lead.model';
import CallTask from '../src/models/callTask.model';

describe('Call Task Tests', () => {
  let authToken: string;
  let userId: number;
  let leadId: number;

  beforeAll(async () => {
    await CallTask.destroy({ where: {} });
    await Lead.destroy({ where: {} });
    await User.destroy({ where: {} });

    const user = await User.create({
      name: 'Test Agent',
      email: 'agent2@test.com',
      password: await require('bcrypt').hash('Test@123', 10),
      role: 'agent',
    });
    userId = user.id;

    const lead = await Lead.create({
      name: 'Test Lead',
      phone: '+919876543250',
      email: 'lead@test.com',
      status: 'new',
      source: 'website',
    });
    leadId = lead.id;

    const loginResponse = await request(app).post('/api/auth/login').send({
      email: 'agent2@test.com',
      password: 'Test@123',
    });

    authToken = loginResponse.body.accessToken;
  });

  afterAll(async () => {
    await CallTask.destroy({ where: {} });
    await Lead.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  it('should create a call task with idempotency', async () => {
    const taskData = {
      lead_id: leadId,
      assigned_to: userId,
      scheduled_at: new Date().toISOString(),
      idempotency_key: 'test-key-123',
    };

    const response1 = await request(app)
      .post('/api/call-tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send(taskData);

    expect(response1.status).toBe(201);

    // Send again with same idempotency key
    const response2 = await request(app)
      .post('/api/call-tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send(taskData);

    expect(response2.status).toBe(200);
    expect(response2.body.message).toContain('idempotent');
  });

  it('should complete a call task', async () => {
    const task = await CallTask.create({
      lead_id: leadId,
      assigned_to: userId,
      scheduled_at: new Date(),
      status: 'pending',
    });

    const response = await request(app)
      .put(`/api/call-tasks/${task.id}/complete`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        notes: 'Customer interested',
        outcome: 'follow_up',
        duration_minutes: 15,
      });

    expect(response.status).toBe(200);
    expect(response.body.task.status).toBe('completed');
  });
});
