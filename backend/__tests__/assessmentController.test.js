const Assessment = require('../models/assessmentModel');
const { getAssessmentById } = require('../controllers/assessmentController');

jest.mock('../models/assessmentModel');

describe('getAssessmentById controller', () => {
  it('retrieves an existing assessment', async () => {
    const mockAssessment = { _id: '123', name: 'Test User' };
    Assessment.findById.mockResolvedValue(mockAssessment);

    const req = { params: { assessmentId: '123' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await getAssessmentById(req, res);

    expect(Assessment.findById).toHaveBeenCalledWith('123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: mockAssessment
      })
    );
  });
});
