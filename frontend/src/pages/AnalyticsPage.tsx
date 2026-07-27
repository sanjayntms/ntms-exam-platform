import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { BarChart3, TrendingUp, PieChart, Download } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics/dashboard');
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Enterprise Analytics & Reports</h2>
          <p className="text-xs text-slate-400 mt-1">Pass rate metrics, difficulty distribution & candidate performance trends</p>
        </div>
        <button
          onClick={() => alert('Exporting full analytics dataset to CSV/Excel...')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/20"
        >
          <Download className="w-4 h-4" /> Export Excel Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase text-blue-400">
            <TrendingUp className="w-4 h-4" /> Certification Pass Rate Trends
          </h3>

          <div className="h-48 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center p-4">
            <div className="w-full space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>AZ-900 Microsoft Azure Fundamentals</span>
                  <span className="text-emerald-400 font-mono font-bold">85% Pass</span>
                </div>
                <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-gradient-to-r from-blue-600 to-emerald-400 h-full w-[85%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>AWS Solutions Architect Associate</span>
                  <span className="text-emerald-400 font-mono font-bold">78% Pass</span>
                </div>
                <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-gradient-to-r from-blue-600 to-emerald-400 h-full w-[78%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Cisco 200-301 CCNA</span>
                  <span className="text-emerald-400 font-mono font-bold">72% Pass</span>
                </div>
                <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-gradient-to-r from-blue-600 to-emerald-400 h-full w-[72%]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase text-amber-400">
            <PieChart className="w-4 h-4" /> Question Bank Type Breakdown
          </h3>

          <div className="h-48 bg-slate-950 rounded-xl border border-slate-800 p-4 grid grid-cols-2 gap-4 items-center">
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500" />
                <span>Choice & True/False (40%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-emerald-500" />
                <span>Case Studies (20%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-amber-500" />
                <span>Simulations (20%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-purple-500" />
                <span>Hands-on Labs (20%)</span>
              </div>
            </div>

            <div className="w-28 h-28 mx-auto rounded-full border-8 border-blue-500/40 flex items-center justify-center font-mono font-bold text-xl text-white shadow-xl shadow-blue-500/20">
              16 Types
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
