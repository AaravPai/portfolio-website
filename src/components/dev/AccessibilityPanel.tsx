import React, { useState, useEffect } from 'react';
import { runAccessibilityAudit, type AccessibilityAuditResult, type AccessibilityIssue } from '../../utils/accessibilityAudit';
import './AccessibilityPanel.css';

interface AccessibilityPanelProps {
  isVisible?: boolean;
  onToggle?: () => void;
}

const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ 
  isVisible = false, 
  onToggle 
}) => {
  const [auditResult, setAuditResult] = useState<AccessibilityAuditResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<AccessibilityIssue | null>(null);

  const runAudit = async () => {
    setIsRunning(true);
    try {
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      const result = runAccessibilityAudit();
      setAuditResult(result);
    } catch (error) {
      console.error('Accessibility audit failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const highlightElement = (element: HTMLElement) => {
    // Remove previous highlights
    document.querySelectorAll('.a11y-highlight').forEach(el => {
      el.classList.remove('a11y-highlight');
    });

    // Add highlight to current element
    element.classList.add('a11y-highlight');
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Remove highlight after 3 seconds
    setTimeout(() => {
      element.classList.remove('a11y-highlight');
    }, 3000);
  };

  const getIssueIcon = (type: AccessibilityIssue['type']) => {
    switch (type) {
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '•';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#28a745'; // Green
    if (score >= 70) return '#ffc107'; // Yellow
    return '#dc3545'; // Red
  };

  useEffect(() => {
    // Run initial audit when panel becomes visible
    if (isVisible && !auditResult) {
      runAudit();
    }
  }, [isVisible]);

  if (!isVisible) {
    return (
      <button
        className="a11y-panel-toggle"
        onClick={onToggle}
        aria-label="Open accessibility panel"
        title="Accessibility Audit"
      >
        🔍
      </button>
    );
  }

  return (
    <div className="a11y-panel">
      <div className="a11y-panel__header">
        <h3>Accessibility Audit</h3>
        <div className="a11y-panel__controls">
          <button
            className="a11y-panel__refresh"
            onClick={runAudit}
            disabled={isRunning}
            aria-label="Refresh audit"
          >
            {isRunning ? '⏳' : '🔄'}
          </button>
          <button
            className="a11y-panel__close"
            onClick={onToggle}
            aria-label="Close accessibility panel"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="a11y-panel__content">
        {isRunning ? (
          <div className="a11y-panel__loading">
            <div className="a11y-panel__spinner"></div>
            <p>Running accessibility audit...</p>
          </div>
        ) : auditResult ? (
          <>
            <div className="a11y-panel__score">
              <div 
                className="a11y-panel__score-circle"
                style={{ borderColor: getScoreColor(auditResult.score) }}
              >
                <span style={{ color: getScoreColor(auditResult.score) }}>
                  {auditResult.score}
                </span>
              </div>
              <div className="a11y-panel__score-details">
                <p>Accessibility Score</p>
                <div className="a11y-panel__summary">
                  <span className="a11y-panel__summary-item error">
                    {auditResult.summary.errors} errors
                  </span>
                  <span className="a11y-panel__summary-item warning">
                    {auditResult.summary.warnings} warnings
                  </span>
                  <span className="a11y-panel__summary-item info">
                    {auditResult.summary.info} info
                  </span>
                </div>
              </div>
            </div>

            {auditResult.issues.length > 0 ? (
              <div className="a11y-panel__issues">
                <h4>Issues Found ({auditResult.issues.length})</h4>
                <div className="a11y-panel__issues-list">
                  {auditResult.issues.map((issue, index) => (
                    <div
                      key={index}
                      className={`a11y-panel__issue a11y-panel__issue--${issue.type}`}
                      onClick={() => {
                        setSelectedIssue(issue);
                        highlightElement(issue.element);
                      }}
                    >
                      <div className="a11y-panel__issue-header">
                        <span className="a11y-panel__issue-icon">
                          {getIssueIcon(issue.type)}
                        </span>
                        <span className="a11y-panel__issue-message">
                          {issue.message}
                        </span>
                      </div>
                      <div className="a11y-panel__issue-element">
                        {issue.element.tagName.toLowerCase()}
                        {issue.element.id && `#${issue.element.id}`}
                        {issue.element.className && `.${issue.element.className.split(' ')[0]}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="a11y-panel__success">
                <div className="a11y-panel__success-icon">✅</div>
                <p>No accessibility issues found!</p>
                <p className="a11y-panel__success-subtitle">
                  Great job maintaining accessible code.
                </p>
              </div>
            )}

            {selectedIssue && (
              <div className="a11y-panel__issue-details">
                <h4>Issue Details</h4>
                <div className="a11y-panel__issue-detail">
                  <strong>Message:</strong> {selectedIssue.message}
                </div>
                {selectedIssue.wcagGuideline && (
                  <div className="a11y-panel__issue-detail">
                    <strong>WCAG Guideline:</strong> {selectedIssue.wcagGuideline}
                  </div>
                )}
                {selectedIssue.suggestion && (
                  <div className="a11y-panel__issue-detail">
                    <strong>Suggestion:</strong> {selectedIssue.suggestion}
                  </div>
                )}
                <button
                  className="a11y-panel__close-details"
                  onClick={() => setSelectedIssue(null)}
                >
                  Close Details
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="a11y-panel__empty">
            <p>Click refresh to run accessibility audit</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessibilityPanel;