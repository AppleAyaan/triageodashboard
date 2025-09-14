function AlertCard({ alert }) {
  const severityColors = {
    critical: "rgba(255, 0, 0, 0.3)",   // brighter red
    high: "rgba(255, 140, 0, 0.3)",     // neon orange
    medium: "rgba(255, 255, 0, 0.3)",   // neon yellow
    low: "rgba(0, 255, 0, 0.3)",        // neon green
  };

  const backgroundColor =
    severityColors[alert.severity?.toLowerCase()] || "rgba(255, 255, 255, 0.1)";

  return (
    <div
      style={{
        width: "300px",
        flexShrink: 0,
        flexGrow: 0,
        padding: "12px",
        paddingLeft: "16px",
        margin: "8px",
        borderRadius: "8px",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        background: backgroundColor,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        transition: "background 0.3s ease, box-shadow 0.3s ease",
        cursor: "pointer",
        overflow: "hidden",
        boxSizing: "border-box",
        position: "relative",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = backgroundColor.replace(/[\d\.]+\)$/g, "0.25)");
        e.currentTarget.style.boxShadow = "0 8px 12px rgba(0, 0, 0, 0.2)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = backgroundColor;
        e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
      }}
    >
      <h2>
        {alert.severity?.toUpperCase()} – {alert.category}
      </h2>
      <p>{alert.summary}</p>
      <ul>
        {alert.recommended_actions?.map((act, i) => (
          <li key={i}>{act}</li>
        ))}
      </ul>
      <small>{alert.evidence?.join(", ")}</small>
    </div>
  );
}

export default AlertCard;
