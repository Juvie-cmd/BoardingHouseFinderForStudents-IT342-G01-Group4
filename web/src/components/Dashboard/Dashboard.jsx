import { useState } from 'react';
import { DashboardHeader, TabNavigation } from './index';

/**
 * Reusable Dashboard Component
 *
 * This component provides a consistent dashboard layout for all user roles.
 * Role-specific content is passed via props and children.
 *
 * @param {Object} props
 * @param {string} props.title - Dashboard title
 * @param {string} props.subtitle - Dashboard subtitle
 * @param {React.ReactNode} props.headerActions - Actions to show in header (e.g., buttons)
 * @param {Array} props.tabs - Array of tab objects [{ id, label, badge? }]
 * @param {string} props.defaultTab - Default selected tab ID
 * @param {Function} props.renderTabContent - Function that receives (selectedTab) and returns JSX
 * @param {string} props.className - Additional CSS class for the dashboard page
 * @param {string} props.contentClassName - Additional CSS class for main content
 * @param {string} props.tabsClassName - Additional CSS class for tabs
 */
export function Dashboard({
  title,
  subtitle,
  headerActions,
  tabs,
  defaultTab,
  renderTabContent,
  className = '',
  contentClassName = '',
  tabsClassName = ''
}) {
  const [selectedTab, setSelectedTab] = useState(defaultTab || (tabs && tabs[0]?.id) || '');

  return (
    <div className={`dashboard-page page-container ${className}`}>
      {/* Header */}
      <DashboardHeader
        title={title}
        subtitle={subtitle}
        actions={headerActions}
      />

      <div className={`container dashboard-main-content ${contentClassName}`}>
        {/* Tabs Navigation */}
        {tabs && tabs.length > 0 && (
          <TabNavigation
            tabs={tabs}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            className={tabsClassName}
          />
        )}

        {/* Tab Content */}
        <div className="dashboard-tabs-content">
          {renderTabContent ? renderTabContent(selectedTab) : null}
        </div>
      </div>
    </div>
  );
}
