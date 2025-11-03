import { Card, CardHeader, CardContent } from '../UI';
import './styles/ActivityCard.css';

export function ActivityCard({ title = 'Recent Activity', activities = [] }) {
  return (
    <Card className="activity-card">
      <CardHeader>
        <h3>{title}</h3>
      </CardHeader>
      <CardContent>
        <div className="activity-list">
          {activities.map((activity, index) => (
            <ActivityItem key={activity.id || index} {...activity} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ActivityItem({ action, user, time }) {
  return (
    <div className="activity-item">
      <div className="activity-dot"></div>
      <div className="activity-content">
        <p className="activity-action">{action}</p>
        <p className="activity-user">{user}</p>
        <p className="activity-time">{time}</p>
      </div>
    </div>
  );
}
