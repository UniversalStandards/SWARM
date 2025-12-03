import React from 'react';

interface WorkflowToolbarProps {
  isDirty: boolean;
  onSave: () => void;
  onValidate: () => void;
  onExecute?: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
}

const WorkflowToolbar: React.FC<WorkflowToolbarProps> = ({
  isDirty,
  onSave,
  onValidate,
  onExecute,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onZoomIn,
  onZoomOut,
  onFitView,
}) => {
  return (
    <div style={styles.toolbar}>
      <button
        style={{ ...styles.button, ...(isDirty ? styles.dirty : {}) }}
        onClick={onSave}
        title="Save"
      >
        💾 {isDirty ? '*' : ''}
      </button>
      <button style={styles.button} onClick={onValidate} title="Validate">
        ✔️
      </button>
      {onExecute && (
        <button style={styles.button} onClick={onExecute} title="Execute">
          ▶️
        </button>
      )}
      <button
        style={{ ...styles.button, ...(canUndo ? {} : styles.disabled) }}
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo"
      >
        ↩️
      </button>
      <button
        style={{ ...styles.button, ...(canRedo ? {} : styles.disabled) }}
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo"
      >
        ↪️
      </button>
      <button style={styles.button} onClick={onZoomIn} title="Zoom In">
        ➕
      </button>
      <button style={styles.button} onClick={onZoomOut} title="Zoom Out">
        ➖
      </button>
      <button style={styles.button} onClick={onFitView} title="Fit View">
        🔍
      </button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  toolbar: {
    display: 'flex',
    gap: '8px',
    padding: '8px 12px',
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
  },
  button: {
    background: 'rgba(255, 255, 255, 0.25)',
    border: 'none',
    borderRadius: '8px',
    padding: '6px 12px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  },
  dirty: {
    backgroundColor: '#ffcc00',
    color: '#000',
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};

export default WorkflowToolbar;
