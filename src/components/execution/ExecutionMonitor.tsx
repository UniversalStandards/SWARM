import React, { useState, useEffect, useRef } from 'react';
import './ExecutionMonitor.css';

const TABS = [
  'Progress',
  'Node Status',
  'Agent Activity',
  'Logs',
  'Artifacts',
];

interface NodeStatus {
  id: number;
  name: string;
  status: string;
}

interface AgentActivity {
  id: number;
  agent: string;
  activity: string;
}

interface Artifact {
  id: number;
  name: string;
  url: string;
}

const ExecutionMonitor = () => {
  const [activeTab, setActiveTab] = useState('Progress');
  const [progress, setProgress] = useState(0);
  const [nodeStatus, setNodeStatus] = useState<NodeStatus[]>([]);
  const [agentActivity, setAgentActivity] = useState<AgentActivity[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + Math.random() * 5 : 100));
      setNodeStatus([
        { id: 1, name: 'Node 1', status: Math.random() > 0.2 ? 'Online' : 'Offline' },
        { id: 2, name: 'Node 2', status: Math.random() > 0.2 ? 'Online' : 'Offline' },
        { id: 3, name: 'Node 3', status: Math.random() > 0.2 ? 'Online' : 'Offline' },
      ]);
      setAgentActivity([
        { id: 1, agent: 'Agent A', activity: Math.random() > 0.5 ? 'Active' : 'Idle' },
        { id: 2, agent: 'Agent B', activity: Math.random() > 0.5 ? 'Active' : 'Idle' },
      ]);
      setLogs((prev) => [...prev, `Log entry at ${new Date().toLocaleTimeString()}`]);
      setArtifacts([
        { id: 1, name: 'Artifact 1', url: '#' },
        { id: 2, name: 'Artifact 2', url: '#' },
      ]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <div className="execution-monitor">
      <nav className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="tab-content">
        {activeTab === 'Progress' && (
          <div className="progress-tab">
            <h2>Execution Progress</h2>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p>{progress.toFixed(2)}%</p>
          </div>
        )}

        {activeTab === 'Node Status' && (
          <div className="node-status-tab">
            <h2>Node Status</h2>
            <ul>
              {nodeStatus.map((node) => (
                <li key={node.id} className={node.status.toLowerCase()}>
                  {node.name}: {node.status}
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'Agent Activity' && (
          <div className="agent-activity-tab">
            <h2>Agent Activity</h2>
            <ul>
              {agentActivity.map((agent) => (
                <li key={agent.id} className={agent.activity.toLowerCase()}>
                  {agent.agent}: {agent.activity}
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'Logs' && (
          <div className="logs-tab">
            <h2>Streaming Logs</h2>
            <div className="log-viewer">
              {logs.map((log, index) => (
                <p key={index}>{log}</p>
              ))}
              <div ref={logsEndRef} />
            </div>
          </div>
        )}

        {activeTab === 'Artifacts' && (
          <div className="artifacts-tab">
            <h2>Artifact Gallery</h2>
            <div className="artifact-gallery">
              {artifacts.map((artifact) => (
                <a key={artifact.id} href={artifact.url} target="_blank" rel="noopener noreferrer">
                  {artifact.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutionMonitor;
