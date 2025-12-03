import React, { useState, useEffect } from "react";

// Types for validation issues
interface ValidationIssue {
  type: "error" | "warning" | "info";
  message: string;
}

interface ValidationPanelProps {
  workflow: any; // The workflow object to validate
  onClose: () => void;
}

const ValidationPanel: React.FC<ValidationPanelProps> = ({ workflow, onClose }) => {
  const [issues, setIssues] = useState<ValidationIssue[]>([]);

  // Utility: Detect cycles in the workflow graph
  const detectCycles = (nodes: any[], edges: any[]) => {
    const graph: Record<string, string[]> = {};
    nodes.forEach((node) => {
      graph[node.id] = [];
    });
    edges.forEach((edge) => {
      if (graph[edge.source]) {
        graph[edge.source].push(edge.target);
      }
    });

    const visited: Set<string> = new Set();
    const recStack: Set<string> = new Set();
    const cycles: string[][] = [];

    const dfs = (nodeId: string, path: string[]) => {
      if (!visited.has(nodeId)) {
        visited.add(nodeId);
        recStack.add(nodeId);
        path.push(nodeId);

        for (const neighbor of graph[nodeId]) {
          if (!visited.has(neighbor)) {
            dfs(neighbor, path);
          } else if (recStack.has(neighbor)) {
            // Cycle detected
            const cycleStartIndex = path.indexOf(neighbor);
            if (cycleStartIndex !== -1) {
              cycles.push(path.slice(cycleStartIndex));
            }
          }
        }
      }
      recStack.delete(nodeId);
      path.pop();
    };

    nodes.forEach((node) => {
      if (!visited.has(node.id)) {
        dfs(node.id, []);
      }
    });

    return cycles;
  };

  // Validate workflow structure
  const validateWorkflow = () => {
    const newIssues: ValidationIssue[] = [];

    if (!workflow) {
      newIssues.push({ type: "error", message: "Workflow is empty or undefined." });
      setIssues(newIssues);
      return;
    }

    const nodes = workflow.nodes || [];
    const edges = workflow.edges || [];

    if (nodes.length === 0) {
      newIssues.push({ type: "error", message: "Workflow has no nodes." });
    }

    // Check for disconnected nodes
    const connectedNodes = new Set<string>();
    edges.forEach((edge) => {
      connectedNodes.add(edge.source);
      connectedNodes.add(edge.target);
    });
    nodes.forEach((node) => {
      if (!connectedNodes.has(node.id)) {
        newIssues.push({ type: "warning", message: `Node '${node.id}' is disconnected.` });
      }
    });

    // Check for cycles
    const cycles = detectCycles(nodes, edges);
    if (cycles.length > 0) {
      cycles.forEach((cycle, index) => {
        newIssues.push({ type: "error", message: `Cycle detected: ${cycle.join(" -> ")}` });
      });
    }

    // Check for start and end nodes
    const startNodes = nodes.filter((node) => !edges.some((edge) => edge.target === node.id));
    const endNodes = nodes.filter((node) => !edges.some((edge) => edge.source === node.id));

    if (startNodes.length === 0) {
      newIssues.push({ type: "error", message: "No start node found (node with no incoming edges)." });
    }
    if (endNodes.length === 0) {
      newIssues.push({ type: "error", message: "No end node found (node with no outgoing edges)." });
    }

    setIssues(newIssues);
  };

  useEffect(() => {
    validateWorkflow();
  }, [workflow]);

  const errorCount = issues.filter((i) => i.type === "error").length;
  const warningCount = issues.filter((i) => i.type === "warning").length;
  const infoCount = issues.filter((i) => i.type === "info").length;

  const hasErrors = errorCount > 0;

  // Icons for issue types
  const icons = {
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.panel}>
        <header style={{ ...styles.header, backgroundColor: hasErrors ? "#ff4d4f" : "#52c41a" }}>
          {hasErrors ? "Validation Errors Found" : "Validation Successful"}
          <button onClick={onClose} style={styles.closeButton} aria-label="Close validation panel">
            ×
          </button>
        </header>
        <div style={styles.summary}>
          <div style={styles.issueCount}>
            {icons.error} Errors: {errorCount}
          </div>
          <div style={styles.issueCount}>
            {icons.warning} Warnings: {warningCount}
          </div>
          <div style={styles.issueCount}>
            {icons.info} Info: {infoCount}
          </div>
        </div>
        <div style={styles.issueList}>
          {issues.map((issue, index) => (
            <div key={index} style={{ ...styles.issueItem, borderLeftColor: issue.type === "error" ? "#ff4d4f" : issue.type === "warning" ? "#faad14" : "#1890ff" }}>
              <span style={styles.issueIcon}>{icons[issue.type]}</span>
              <span>{issue.message}</span>
            </div>
          ))}
          {issues.length === 0 && <div>No validation issues found.</div>}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  panel: {
    background: "rgba(255, 255, 255, 0.15)",
    borderRadius: "16px",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    width: "90vw",
    maxWidth: "600px",
    maxHeight: "80vh",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: "16px",
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopLeftRadius: "16px",
    borderTopRightRadius: "16px",
  },
  closeButton: {
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: "1.5rem",
    cursor: "pointer",
    lineHeight: 1,
  },
  summary: {
    display: "flex",
    justifyContent: "space-around",
    padding: "12px 16px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "white",
    fontWeight: "600",
  },
  issueCount: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  issueList: {
    padding: "16px",
    color: "white",
    flexGrow: 1,
    overflowY: "auto",
  },
  issueItem: {
    padding: "8px 12px",
    marginBottom: "8px",
    borderLeft: "4px solid",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  issueIcon: {
    fontSize: "1.25rem",
  },
};

export default ValidationPanel;
