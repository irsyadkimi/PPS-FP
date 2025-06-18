const Assessment = require('../models/assessmentModel');

class AssessmentHistoryService {
  
  // Save assessment to history
  async saveAssessment(assessmentData) {
    try {
      // Assessment is already saved in the controller
      // This method can be used for additional logging or processing
      console.log(`Assessment saved for user: ${assessmentData.userId}`);
      return { success: true, assessmentId: assessmentData._id };
    } catch (error) {
      console.error('Error in saveAssessment:', error);
      throw error;
    }
  }

  // Get user's assessment history
  async getUserHistory(userId, options = {}) {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
      const skip = (page - 1) * limit;

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Get assessments with pagination
      const assessments = await Assessment
        .find({ userId })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('-__v')
        .lean();

      // Get total count for pagination
      const totalCount = await Assessment.countDocuments({ userId });
      const totalPages = Math.ceil(totalCount / limit);

      // Calculate statistics
      const stats = await this.calculateUserStats(userId);

      return {
        assessments,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit
        },
        statistics: stats
      };

    } catch (error) {
      console.error('Error getting user history:', error);
      throw error;
    }
  }

  // Calculate user statistics
  async calculateUserStats(userId) {
    try {
      const assessments = await Assessment
        .find({ userId })
        .sort({ createdAt: 1 })
        .lean();

      if (assessments.length === 0) {
        return {
          totalAssessments: 0,
          firstAssessment: null,
          latestAssessment: null,
          progressSummary: null
        };
      }

      const first = assessments[0];
      const latest = assessments[assessments.length - 1];

      const stats = {
        totalAssessments: assessments.length,
        firstAssessment: first.createdAt,
        latestAssessment: latest.createdAt,
        progressSummary: this.calculateProgress(first, latest),
        trends: this.calculateTrends(assessments),
        goalHistory: this.getGoalHistory(assessments)
      };

      return stats;

    } catch (error) {
      console.error('Error calculating user stats:', error);
      throw error;
    }
  }

  // Calculate progress between first and latest assessment
  calculateProgress(firstAssessment, latestAssessment) {
    const first = firstAssessment.personalData;
    const latest = latestAssessment.personalData;

    const weightChange = latest.weight - first.weight;
    const firstBMI = firstAssessment.results?.analysis?.bmi || 0;
    const latestBMI = latestAssessment.results?.analysis?.bmi || 0;
    const bmiChange = latestBMI - firstBMI;

    return {
      weightChange: Math.round(weightChange * 10) / 10,
      bmiChange: Math.round(bmiChange * 10) / 10,
      timeSpan: {
        days: Math.floor((latestAssessment.createdAt - firstAssessment.createdAt) / (1000 * 60 * 60 * 24)),
        months: Math.floor((latestAssessment.createdAt - firstAssessment.createdAt) / (1000 * 60 * 60 * 24 * 30))
      },
      direction: {
        weight: weightChange > 0 ? 'increase' : weightChange < 0 ? 'decrease' : 'stable',
        bmi: bmiChange > 0 ? 'increase' : bmiChange < 0 ? 'decrease' : 'stable'
      }
    };
  }

  // Calculate trends over time
  calculateTrends(assessments) {
    if (assessments.length < 2) {
      return { insufficient_data: true };
    }

    const weights = assessments.map(a => a.personalData.weight);
    const bmis = assessments.map(a => a.results?.analysis?.bmi || 0);
    const dates = assessments.map(a => a.createdAt);

    return {
      weight: {
        data: weights,
        trend: this.calculateLinearTrend(weights),
        average: weights.reduce((a, b) => a + b, 0) / weights.length,
        range: { min: Math.min(...weights), max: Math.max(...weights) }
      },
      bmi: {
        data: bmis,
        trend: this.calculateLinearTrend(bmis),
        average: bmis.reduce((a, b) => a + b, 0) / bmis.length,
        range: { min: Math.min(...bmis), max: Math.max(...bmis) }
      },
      timeframe: {
        start: dates[0],
        end: dates[dates.length - 1],
        assessmentFrequency: this.calculateAssessmentFrequency(dates)
      }
    };
  }

  // Calculate linear trend (slope)
  calculateLinearTrend(values) {
    const n = values.length;
    if (n < 2) return 0;

    const x = Array.from({ length: n }, (_, i) => i);
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * values[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return Math.round(slope * 1000) / 1000; // Round to 3 decimal places
  }

  // Calculate assessment frequency
  calculateAssessmentFrequency(dates) {
    if (dates.length < 2) return null;

    const intervals = [];
    for (let i = 1; i < dates.length; i++) {
      const daysDiff = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
      intervals.push(daysDiff);
    }

    const averageInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    return Math.round(averageInterval);
  }

  // Get goal history
  getGoalHistory(assessments) {
    const goalCounts = {};
    const goalChanges = [];

    assessments.forEach((assessment, index) => {
      const goal = assessment.goal;
      goalCounts[goal] = (goalCounts[goal] || 0) + 1;

      if (index > 0 && assessments[index - 1].goal !== goal) {
        goalChanges.push({
          from: assessments[index - 1].goal,
          to: goal,
          date: assessment.createdAt
        });
      }
    });

    return {
      counts: goalCounts,
      changes: goalChanges,
      currentGoal: assessments[assessments.length - 1].goal
    };
  }

  // Get assessment comparison
  async compareAssessments(userId, assessmentId1, assessmentId2) {
    try {
      const [assessment1, assessment2] = await Promise.all([
        Assessment.findOne({ _id: assessmentId1, userId }).lean(),
        Assessment.findOne({ _id: assessmentId2, userId }).lean()
      ]);

      if (!assessment1 || !assessment2) {
        throw new Error('One or both assessments not found');
      }

      const comparison = {
        assessment1: {
          id: assessment1._id,
          date: assessment1.createdAt,
          data: assessment1.personalData,
          results: assessment1.results,
          goal: assessment1.goal
        },
        assessment2: {
          id: assessment2._id,
          date: assessment2.createdAt,
          data: assessment2.personalData,
          results: assessment2.results,
          goal: assessment2.goal
        },
        differences: this.calculateDifferences(assessment1, assessment2)
      };

      return comparison;

    } catch (error) {
      console.error('Error comparing assessments:', error);
      throw error;
    }
  }

  // Calculate differences between two assessments
  calculateDifferences(assessment1, assessment2) {
    const data1 = assessment1.personalData;
    const data2 = assessment2.personalData;
    const results1 = assessment1.results?.analysis || {};
    const results2 = assessment2.results?.analysis || {};

    return {
      weight: {
        change: data2.weight - data1.weight,
        percentage: ((data2.weight - data1.weight) / data1.weight * 100).toFixed(1)
      },
      bmi: {
        change: (results2.bmi || 0) - (results1.bmi || 0),
        categoryChange: {
          from: results1.bmiCategory || 'Unknown',
          to: results2.bmiCategory || 'Unknown'
        }
      },
      goal: {
        changed: assessment1.goal !== assessment2.goal,
        from: assessment1.goal,
        to: assessment2.goal
      },
      timespan: {
        days: Math.floor((assessment2.createdAt - assessment1.createdAt) / (1000 * 60 * 60 * 24))
      },
      healthScore: {
        change: (results2.healthScore || 0) - (results1.healthScore || 0)
      }
    };
  }

  // Delete user's assessment history
  async deleteUserHistory(userId, keepLatest = true) {
    try {
      let deleteQuery = { userId };

      if (keepLatest) {
        // Get the latest assessment ID
        const latestAssessment = await Assessment
          .findOne({ userId })
          .sort({ createdAt: -1 })
          .select('_id');

        if (latestAssessment) {
          deleteQuery._id = { $ne: latestAssessment._id };
        }
      }

      const result = await Assessment.deleteMany(deleteQuery);
      return {
        deletedCount: result.deletedCount,
        keptLatest: keepLatest
      };

    } catch (error) {
      console.error('Error deleting user history:', error);
      throw error;
    }
  }

  // Export user data
  async exportUserData(userId, format = 'json') {
    try {
      const assessments = await Assessment
        .find({ userId })
        .sort({ createdAt: 1 })
        .lean();

      const exportData = {
        userId,
        exportDate: new Date(),
        totalAssessments: assessments.length,
        assessments: assessments.map(assessment => ({
          date: assessment.createdAt,
          personalData: assessment.personalData,
          goal: assessment.goal,
          diseases: assessment.diseases,
          results: assessment.results
        }))
      };

      if (format === 'csv') {
        return this.convertToCSV(exportData.assessments);
      }

      return exportData;

    } catch (error) {
      console.error('Error exporting user data:', error);
      throw error;
    }
  }

  // Convert data to CSV format
  convertToCSV(assessments) {
    if (assessments.length === 0) return '';

    const headers = [
      'Date',
      'Age',
      'Weight',
      'Height',
      'Goal',
      'Diseases',
      'BMI',
      'BMI Category',
      'Daily Calories',
      'Health Score'
    ];

    const rows = assessments.map(assessment => [
      assessment.date,
      assessment.personalData.age,
      assessment.personalData.weight,
      assessment.personalData.height,
      assessment.goal,
      (assessment.diseases || []).join(';'),
      assessment.results?.analysis?.bmi || '',
      assessment.results?.analysis?.bmiCategory || '',
      assessment.results?.analysis?.dailyCalories || '',
      assessment.results?.healthScore || ''
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}

module.exports = new AssessmentHistoryService();