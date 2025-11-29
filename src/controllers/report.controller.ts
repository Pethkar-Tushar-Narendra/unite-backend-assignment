import { Request, Response } from 'express';
import { CallLog } from '../models/callLog.model';
import { AuthRequest } from '../middlewares/auth.middleware';

// Daily summary report
export const getDailySummary = async (req: AuthRequest, res: Response) => {
  try {
    const { date } = req.query; // Format: YYYY-MM-DD
    const targetDate = date
      ? String(date)
      : new Date().toISOString().split('T')[0];

    const summary = await CallLog.aggregate([
      {
        $match: {
          call_date: targetDate,
        },
      },
      {
        $group: {
          _id: null,
          total_calls: { $sum: 1 },
          completed_calls: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
          missed_calls: {
            $sum: { $cond: [{ $eq: ['$status', 'missed'] }, 1, 0] },
          },
          pending_calls: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
          },
          total_duration: { $sum: '$duration_minutes' },
        },
      },
      {
        $project: {
          _id: 0,
          date: targetDate,
          total_calls: 1,
          completed_calls: 1,
          missed_calls: 1,
          pending_calls: 1,
          total_duration_minutes: '$total_duration',
          completion_rate: {
            $multiply: [{ $divide: ['$completed_calls', '$total_calls'] }, 100],
          },
        },
      },
    ]);

    res.json({
      summary: summary[0] || {
        date: targetDate,
        total_calls: 0,
        completed_calls: 0,
        missed_calls: 0,
        pending_calls: 0,
        total_duration_minutes: 0,
        completion_rate: 0,
      },
    });
  } catch (error: any) {
    console.error('Error generating daily summary:', error);
    res
      .status(500)
      .json({ message: 'Error generating summary', error: error.message });
  }
};

// Per-agent performance report
export const getAgentPerformance = async (req: AuthRequest, res: Response) => {
  try {
    const { start_date, end_date } = req.query;

    const matchStage: any = {};
    if (start_date && end_date) {
      matchStage.call_date = {
        $gte: String(start_date),
        $lte: String(end_date),
      };
    }

    const agentStats = await CallLog.aggregate([
      {
        $match: matchStage,
      },
      {
        $group: {
          _id: '$agent_id',
          agent_name: { $first: '$agent_name' },
          total_calls: { $sum: 1 },
          completed_calls: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
          missed_calls: {
            $sum: { $cond: [{ $eq: ['$status', 'missed'] }, 1, 0] },
          },
          total_duration: { $sum: '$duration_minutes' },
        },
      },
      {
        $project: {
          _id: 0,
          agent_id: '$_id',
          agent_name: 1,
          total_calls: 1,
          completed_calls: 1,
          missed_calls: 1,
          total_duration_minutes: '$total_duration',
          completion_percentage: {
            $multiply: [{ $divide: ['$completed_calls', '$total_calls'] }, 100],
          },
          avg_call_duration: {
            $divide: ['$total_duration', '$completed_calls'],
          },
        },
      },
      {
        $sort: { total_calls: -1 },
      },
    ]);

    res.json({ agents: agentStats });
  } catch (error: any) {
    console.error('Error generating agent performance:', error);
    res
      .status(500)
      .json({ message: 'Error generating report', error: error.message });
  }
};

// Insights: Busiest agent, completion rate trends
export const getInsights = async (req: AuthRequest, res: Response) => {
  try {
    const { period } = req.query; // 'week', 'month', or custom date range

    // Find busiest agent
    const busiestAgent = await CallLog.aggregate([
      {
        $group: {
          _id: '$agent_id',
          agent_name: { $first: '$agent_name' },
          total_calls: { $sum: 1 },
        },
      },
      {
        $sort: { total_calls: -1 },
      },
      {
        $limit: 1,
      },
    ]);

    // Overall completion rate
    const completionStats = await CallLog.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          total_calls: '$total',
          completed_calls: '$completed',
          completion_rate: {
            $multiply: [{ $divide: ['$completed', '$total'] }, 100],
          },
        },
      },
    ]);

    // Daily trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

    const dailyTrend = await CallLog.aggregate([
      {
        $match: {
          call_date: { $gte: sevenDaysAgoStr },
        },
      },
      {
        $group: {
          _id: '$call_date',
          total_calls: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          total_calls: 1,
          completed_calls: '$completed',
          completion_rate: {
            $multiply: [{ $divide: ['$completed', '$total_calls'] }, 100],
          },
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);

    res.json({
      insights: {
        busiest_agent: busiestAgent[0] || null,
        overall_stats: completionStats[0] || null,
        daily_trend: dailyTrend,
      },
    });
  } catch (error: any) {
    console.error('Error generating insights:', error);
    res
      .status(500)
      .json({ message: 'Error generating insights', error: error.message });
  }
};
