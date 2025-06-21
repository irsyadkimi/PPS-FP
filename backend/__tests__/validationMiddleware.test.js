const { validateAssessment } = require('../middleware/validation');

describe('validateAssessment middleware - goal field', () => {
  const baseBody = { age: 30, weight: 70, height: 170 };

  const create = (bodyOverrides = {}) => {
    const req = { body: { ...baseBody, ...bodyOverrides } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();
    return { req, res, next };
  };

  it('calls next for valid goal values', () => {
    const { req, res, next } = create({ goal: 'diet' });
    validateAssessment(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns 400 for invalid goal values', () => {
    const { req, res, next } = create({ goal: 'invalid' });
    validateAssessment(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Validation failed',
        errors: ['Goal must be one of: hidup_sehat, diet, massa_otot']
      })
    );
    expect(next).not.toHaveBeenCalled();
  });
});
