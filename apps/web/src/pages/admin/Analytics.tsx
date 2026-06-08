import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

interface Session {
  startTime: { seconds: number };
  totalDuration: number;
  device: { deviceType: string };
  location: { country: string };
}

function generateMockData(): Session[] {
  const data: Session[] = [];
  const now = Date.now();
  for (let i = 0; i < 50; i++) {
    data.push({
      startTime: { seconds: (now - Math.random() * 7 * 24 * 60 * 60 * 1000) / 1000 },
      totalDuration: Math.floor(Math.random() * 600),
      device: { deviceType: Math.random() > 0.6 ? 'Mobile' : 'Desktop' },
      location: { country: Math.random() > 0.5 ? 'Thailand' : Math.random() > 0.5 ? 'USA' : 'Japan' },
    });
  }
  return data;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export function Analytics() {
  const trafficRef = useRef<HTMLCanvasElement>(null);
  const deviceRef = useRef<HTMLCanvasElement>(null);
  const locationRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef<HTMLCanvasElement>(null);
  const [summary, setSummary] = useState({ totalSessions: 0, avgDuration: '0m 0s', activeUsers: 0, bounceRate: '0%' });

  useEffect(() => {
    const sessions = generateMockData();
    const totalSessions = sessions.length;
    const totalDuration = sessions.reduce((acc, s) => acc + (s.totalDuration || 0), 0);
    const avgDuration = totalSessions ? Math.floor(totalDuration / totalSessions) : 0;
    const activeUsers = Math.floor(Math.random() * 5) + 1;
    setSummary({ totalSessions, avgDuration: formatDuration(avgDuration), activeUsers, bounceRate: '35%' });

    const charts: Chart[] = [];

    // Traffic (line)
    const days: Record<string, number> = {};
    sessions.forEach((s) => {
      const date = new Date(s.startTime.seconds * 1000).toLocaleDateString('en-US', { weekday: 'short' });
      days[date] = (days[date] || 0) + 1;
    });
    if (trafficRef.current) {
      charts.push(
        new Chart(trafficRef.current, {
          type: 'line',
          data: {
            labels: Object.keys(days).reverse(),
            datasets: [
              {
                label: 'Sessions',
                data: Object.values(days).reverse(),
                borderColor: '#EAB308',
                backgroundColor: 'rgba(234, 179, 8, 0.1)',
                tension: 0.4,
                fill: true,
              },
            ],
          },
          options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } },
        }),
      );
    }

    // Device (doughnut)
    const devices: Record<string, number> = { Desktop: 0, Mobile: 0, Tablet: 0 };
    sessions.forEach((s) => {
      const t = s.device?.deviceType || 'Desktop';
      devices[t] = (devices[t] || 0) + 1;
    });
    if (deviceRef.current) {
      charts.push(
        new Chart(deviceRef.current, {
          type: 'doughnut',
          data: {
            labels: Object.keys(devices),
            datasets: [{ data: Object.values(devices), backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'] }],
          },
          options: { responsive: true, plugins: { legend: { position: 'bottom' } } },
        }),
      );
    }

    // Location (bar)
    const locations: Record<string, number> = {};
    sessions.forEach((s) => {
      const c = s.location?.country || 'Unknown';
      locations[c] = (locations[c] || 0) + 1;
    });
    if (locationRef.current) {
      charts.push(
        new Chart(locationRef.current, {
          type: 'bar',
          data: {
            labels: Object.keys(locations),
            datasets: [{ label: 'Sessions', data: Object.values(locations), backgroundColor: '#6366F1' }],
          },
          options: { responsive: true, plugins: { legend: { display: false } } },
        }),
      );
    }

    // Time (line)
    const hours = new Array(24).fill(0);
    sessions.forEach((s) => {
      const h = new Date(s.startTime.seconds * 1000).getHours();
      hours[h]++;
    });
    if (timeRef.current) {
      charts.push(
        new Chart(timeRef.current, {
          type: 'line',
          data: {
            labels: hours.map((_, i) => `${i}:00`),
            datasets: [{ label: 'Sessions', data: hours, borderColor: '#EC4899', tension: 0.4 }],
          },
          options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } },
        }),
      );
    }

    return () => charts.forEach((c) => c.destroy());
  }, []);

  return (
    <section className="section active">
      <div className="section-header">
        <h1 className="section-title">Web Analytics</h1>
        <p className="section-description">Real-time user tracking and behavior analysis</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{summary.totalSessions}</div>
          <div className="stat-label">Total Sessions</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{summary.avgDuration}</div>
          <div className="stat-label">Avg. Session Duration</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{summary.activeUsers}</div>
          <div className="stat-label">Active Users (24h)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{summary.bounceRate}</div>
          <div className="stat-label">Bounce Rate</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="card">
          <h3 className="card-title">Traffic Overview (Last 7 Days)</h3>
          <canvas ref={trafficRef} />
        </div>
        <div className="card">
          <h3 className="card-title">Device Segmentation</h3>
          <canvas ref={deviceRef} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 className="card-title">Top Locations</h3>
          <canvas ref={locationRef} />
        </div>
        <div className="card">
          <h3 className="card-title">Peak Traffic Times</h3>
          <canvas ref={timeRef} />
        </div>
      </div>
    </section>
  );
}
