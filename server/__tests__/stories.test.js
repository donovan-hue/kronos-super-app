const request = require('supertest');
const express = require('express');
const { protect } = require('../middleware/auth');
const { register } = require('../controllers/authController');
const storyController = require('../controllers/storyController');
const Story = require('../models/Story');
const StoryProgress = require('../models/StoryProgress');

let app;

beforeAll(() => {
  process.env.JWT_SECRET = 'test_jwt_secret_kronos';
  app = express();
  app.use(express.json());
  app.post('/api/auth/register', register);
  app.post('/api/stories', protect, storyController.createStory);
  app.post('/api/stories/:storyId/rate', protect, storyController.rateStory);
  app.get('/api/stories/:storyId/analytics', protect, storyController.getStoryAnalytics);
});

async function createUser(suffix) {
  const result = await request(app).post('/api/auth/register').send({
    username: `story_${suffix}`,
    email: `story_${suffix}@kronos.test`,
    password: 'Password123',
    firstName: 'Story',
    lastName: 'Tester',
  });
  return { token: result.body.token, id: result.body.user.id };
}

describe('Story analytics', () => {
  test('authors can view calculated analytics and ratings', async () => {
    const author = await createUser('author');
    const player = await createUser('player');
    const story = await Story.create({ title: 'Historia de prueba', author: author.id, status: 'published', isPublic: true });

    await StoryProgress.create({
      storyId: story._id,
      userId: player.id,
      isCompleted: true,
      totalTimeSpent: 120,
      rating: 5,
      review: 'Excelente',
    });

    const response = await request(app)
      .get(`/api/stories/${story._id}/analytics`)
      .set('Authorization', `Bearer ${author.token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.players).toBe(1);
    expect(response.body.data.completions).toBe(1);
    expect(response.body.data.rating.average).toBe(5);
    expect(response.body.data.ratings).toHaveLength(1);
  });

  test('only the author can view analytics', async () => {
    const author = await createUser('private_author');
    const otherUser = await createUser('private_other');
    const story = await Story.create({ title: 'Historia privada', author: author.id });

    const response = await request(app)
      .get(`/api/stories/${story._id}/analytics`)
      .set('Authorization', `Bearer ${otherUser.token}`);

    expect(response.status).toBe(403);
  });
});
