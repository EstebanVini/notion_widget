const request = require('supertest');
const app = require('./server');
const notionService = require('./services/notion');

jest.mock('./services/notion');

describe('API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/posts', () => {
    it('should return 400 if client parameter is missing', async () => {
      const response = await request(app).get('/api/posts');
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Missing client parameter' });
    });

    it('should return posts successfully', async () => {
      const mockPosts = [{ id: '1', title: 'Test Post' }];
      notionService.getPosts.mockResolvedValue(mockPosts);

      const response = await request(app).get('/api/posts?client=roca-demo');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPosts);
      expect(notionService.getPosts).toHaveBeenCalledWith('roca-demo');
    });

    it('should return 500 on service error', async () => {
      notionService.getPosts.mockRejectedValue(new Error('Service error'));
      
      const response = await request(app).get('/api/posts?client=roca-demo');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Service error' });
    });
  });

  describe('POST /api/posts', () => {
    it('should return 400 if client parameter is missing', async () => {
      const response = await request(app).post('/api/posts').send({ title: 'New Post' });
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Missing client parameter' });
    });

    it('should create post successfully', async () => {
      const mockPost = { id: '2', title: 'New Post' };
      notionService.createPost.mockResolvedValue(mockPost);

      const postData = { title: 'New Post', pillar: 'Reel' };
      const response = await request(app)
        .post('/api/posts?client=roca-demo')
        .send(postData);
        
      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockPost);
      expect(notionService.createPost).toHaveBeenCalledWith('roca-demo', postData);
    });
  });

  describe('PATCH /api/posts/:id', () => {
    it('should update post successfully', async () => {
      const mockUpdatedPost = { id: '3', title: 'Updated Post' };
      notionService.updatePost.mockResolvedValue(mockUpdatedPost);

      const updates = { title: 'Updated Post' };
      const response = await request(app)
        .patch('/api/posts/3')
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUpdatedPost);
      expect(notionService.updatePost).toHaveBeenCalledWith('3', updates);
    });

    it('should return 500 on service error', async () => {
      notionService.updatePost.mockRejectedValue(new Error('Update failed'));

      const response = await request(app)
        .patch('/api/posts/3')
        .send({ title: 'Fail' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Update failed' });
    });
  });
});
