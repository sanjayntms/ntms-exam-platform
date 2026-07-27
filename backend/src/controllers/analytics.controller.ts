import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service.js';

export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  async dashboard(req: Request, res: Response) {
    try {
      const data = await this.analyticsService.getDashboardOverview();
      return res.json(data);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
