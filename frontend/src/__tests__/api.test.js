import { jest } from '@jest/globals';
import { assessmentAPI } from '../services/api.js';

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({ success: true })
}));

beforeEach(() => {
  global.fetch.mockClear();
  global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn()
  };
});

test('getAssessmentById calls correct endpoint', async () => {
  const id = '123';
  await assessmentAPI.getAssessmentById(id);
  expect(global.fetch).toHaveBeenCalledWith(
    `http://217.15.160.69:5000/api/v1/assessment/${id}`,
    expect.objectContaining({ method: 'GET' })
  );
});

test('getMealRecommendations calls generic endpoint', async () => {
  await assessmentAPI.getMealRecommendations();
  expect(global.fetch).toHaveBeenCalledWith(
    'http://217.15.160.69:5000/api/v1/recommendation',
    expect.objectContaining({ method: 'GET' })
  );
});

test('getRecommendations returns meals array from mealPlan', async () => {
  const meals = [{ id: 1 }, { id: 2 }];
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve({ success: true, data: { mealPlan: { meals } } })
  });

  const result = await assessmentAPI.getRecommendations();

  expect(result).toEqual(meals);
});
