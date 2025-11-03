import { Card, CardHeader, CardContent } from '../UI';
import './styles/StatsCard.css';

export function StatsCard({ title = 'Statistics', stats = [] }) {
  return (
    <Card className="stats-card">
      <CardHeader>
        <h3>{title}</h3>
      </CardHeader>
      <CardContent>
        <div className="stats-list">
          {stats.map((stat, index) => (
            <StatItem key={index} {...stat} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function StatItem({ icon, label, value, variant = 'blue' }) {
  return (
    <div className="stat-item">
      <div className={`stat-icon ${variant}`}>{icon}</div>
      <div className="stat-info">
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
}
