import AlertCard from "./AlertCard";

function AlertList({ alerts }) {
  if (alerts.length === 0) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", padding: "16px" }}>
        No Alerts at the moment!
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", maxHeight: "80vh", overflowY: "auto", padding: "16px" }}>
      {alerts.map((alert, idx) => (
        <AlertCard key={idx} alert={alert} />
      ))}
    </div>
  );
}

export default AlertList;
