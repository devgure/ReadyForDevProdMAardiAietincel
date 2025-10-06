///admin-dashboard/src/pages/DashboardPage.tsx`typescript

import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';
import {
  Users,
  DollarSign,
  Flag,
  TrendingUp,
  Activity,
  UserCheck,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    premiumUsers: 0,
    totalRevenue: 0,
    pendingReports: 0,
    dailyMatches: 0,
    matchRate: 0,
    churnRate: 0,
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    loadStats();
    loadChartData();
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminApi.get('/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadChartData = async () => {
    try {
      const response = await adminApi.get('/stats/chart');
      setChartData(response.data);
    } catch (error) {
      console.error('Error loading chart data:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={<Users size={24} />}
          color="blue"
          trend="+12%"
        />
        <StatCard
          title="Active Users (DAU)"
          value={stats.activeUsers.toLocaleString()}
          icon={<Activity size={24} />}
          color="green"
          trend="+8%"
        />
        <StatCard
          title="Premium Users"
          value={stats.premiumUsers.toLocaleString()}
          icon={<UserCheck size={24} />}
          color="purple"
          trend="+15%"
        />
        <StatCard
          title="Revenue (MTD)"
          value={`${stats.totalRevenue.toLocaleString()}`}
          icon={<DollarSign size={24} />}
          color="yellow"
          trend="+23%"
        />
      </div>
      
```      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Daily Matches"
          value={stats.dailyMatches.toLocaleString()}
          icon={<TrendingUp size={20} />}
          color="pink"
          small
        />
        <StatCard
          title="Match Rate"
          value={`${stats.matchRate}%`}
          icon={<Activity size={20} />}
          color="green"
          small
        />
        <StatCard
          title="Churn Rate"
          value={`${stats.churnRate}%`}
          icon={<TrendingUp size={20} />}
          color="red"
          small
        />
        <StatCard
          title="Pending Reports"
          value={stats.pendingReports.toLocaleString()}
          icon={<Flag size={20} />}
          color="orange"
          small
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">User Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="premium" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, trend, small }: any) {
  const colorClasses: any = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    pink: 'bg-pink-100 text-pink-600',
    red: 'bg-red-100 text-red-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={`text-gray-600 ${small ? 'text-xs' : 'text-sm'}`}>{title}</p>
          <p className={`font-bold mt-2 ${small ? 'text-2xl' : 'text-3xl'}`}>{value}</p>
          {trend && (
            <p className="text-sm text-green-600 mt-1">
              {trend} from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
      