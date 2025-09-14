import { useEffect, useState } from "react";
import AlertList from "./components/AlertList";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

function App() {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const evtSource = new EventSource("http://localhost:5001/stream");
    evtSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data.replace(/'/g, '"'));
        setAlerts((prev) => [data, ...prev]);
      } catch (err) {
        console.error("Parse error:", err, e.data);
      }
    };
    return () => evtSource.close();
  }, []);

  const filteredAlerts =
    filter === "All"
      ? alerts
      : alerts.filter((alert) => alert.severity === filter);

  const severityCounts = {
    Critical: 0,
    High: 0,
    Medium: 0,
    Low: 0,
  };

  alerts.forEach(alert => {
    if (alert.severity && severityCounts.hasOwnProperty(alert.severity)) {
      severityCounts[alert.severity]++;
    }
  });

  const hasData = Object.values(severityCounts).some(value => value > 0);

  const chartData = hasData
    ? [
        { name: "Critical", value: severityCounts.Critical },
        { name: "High", value: severityCounts.High },
        { name: "Medium", value: severityCounts.Medium },
        { name: "Low", value: severityCounts.Low },
      ]
    : [{ name: "Empty", value: 1 }];

  const COLORS = hasData
    ? {
        Critical: "#ff0000",
        High: "#ffa500",
        Medium: "#ffff00",
        Low: "#00ff00"
      }
    : {
        Empty: "#d3d3d3" // light gray for empty slice
      };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      fontFamily: "Inter, Roboto, sans-serif",
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      background: "linear-gradient(135deg, #0f0f0f 0%, #1c1c1c 100%)",
      color: "white"
    }}>
      <header style={{ 
        backgroundColor: "rgba(255,255,255,0.08)", 
        backdropFilter: "blur(10px)", 
        borderBottom: "1px solid rgba(255, 255, 255, 0.3)", 
        color: "white", 
        padding: "10px 20px", 
        display: "flex", 
        alignItems: "center", 
        position: "relative", // Remove justifyContent
        boxShadow: "0 4px 30px rgba(255, 255, 255, 0.1)"
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: "1.5rem", 
          color: "#e0e0e0",
          position: "absolute", 
          left: "50%", 
          transform: "translateX(-50%)", 
          width: "max-content" 
        }}>Triageo Dashboard</h1>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          fontWeight: "bold", 
          color: "#b0b0b0",
          marginLeft: "auto" // Added to push to right
        }}>
          <span style={{ color: "limegreen", marginRight: "4px" }}>🟢</span> Connected
        </div>
      </header>
      <div style={{ flex: 1, display: "flex", padding: "20px", boxSizing: "border-box" }}>
        <aside style={{ 
          width: "200px", 
          backgroundColor: "rgba(255,255,255,0.08)", 
          backdropFilter: "blur(10px)", 
          padding: "20px", 
          boxSizing: "border-box", 
          borderRadius: "12px",
          boxShadow: "0 8px 32px 0 rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          marginRight: "20px",
          color: "#e0e0e0",
          display: "flex",
          flexDirection: "column"
        }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "10px", color: "#c0c0c0" }}>Filter by Severity</h2>
          {["All", "Critical", "High", "Medium", "Low"].map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              style={{
                display: "block",
                width: "100%",
                padding: "8px",
                marginBottom: "8px",
                backgroundColor: filter === level ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.05)",
                color: filter === level ? "#000" : "#e0e0e0",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                borderRadius: "12px",
                cursor: "pointer",
                textAlign: "left",
                backdropFilter: "blur(10px)",
                transition: "background-color 0.3s ease, color 0.3s ease",
                boxShadow: filter === level ? "0 4px 15px rgba(255, 255, 255, 0.25)" : "none",
              }}
              onMouseEnter={e => {
                const normalizedLevel = level;
                if (normalizedLevel === "Critical") {
                  e.currentTarget.style.backgroundColor = "rgba(255,0,0,0.6)";
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.boxShadow = "0 0 18px 3px rgba(255,0,0,0.7)";
                } else if (normalizedLevel === "High") {
                  e.currentTarget.style.backgroundColor = "rgba(255,165,0,0.6)";
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.boxShadow = "0 0 18px 3px rgba(255,165,0,0.7)";
                } else if (normalizedLevel === "Medium") {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,0,0.6)";
                  e.currentTarget.style.color = "#000";
                  e.currentTarget.style.boxShadow = "0 0 18px 3px rgba(255,255,0,0.7)";
                } else if (normalizedLevel === "Low") {
                  e.currentTarget.style.backgroundColor = "rgba(0,255,0,0.6)";
                  e.currentTarget.style.color = "#000";
                  e.currentTarget.style.boxShadow = "0 0 18px 3px rgba(0,255,0,0.7)";
                } else {
                  // "All"
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
                  e.currentTarget.style.color = "#000";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(255, 255, 255, 0.3)";
                }
              }}
              onMouseLeave={e => {
                const normalizedLevel = level;
                if (filter === level) {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
                  e.currentTarget.style.color = "#000";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(255, 255, 255, 0.25)";
                } else {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.color = "#e0e0e0";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              {level !== "All" ? level.toUpperCase() : level}
            </button>
          ))}
          <img 
            src="logo.png" 
            alt="Logo" 
            style={{ 
              marginTop: "auto", 
              width: "auto", 
              height: "auto", 
              display: "block" 
            }} 
          />
        </aside>
        <main style={{ 
          flex: 1, 
          display: "flex",
          gap: "20px",
          boxSizing: "border-box",
          color: "#e0e0e0"
        }}>
          <div style={{
            width: 320,
            backgroundColor: "rgba(42, 42, 42, 0.8)", // dark gray with transparency for glassy effect
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            boxShadow: "0 8px 32px 0 rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            padding: "20px",
            boxSizing: "border-box",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexShrink: 0,
            height: "100%"
          }}>
            <PieChart width={280} height={280}>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={{
                  fill: "#d3d3d3", // light gray labels
                  fontWeight: "bold",
                }}
              >
                {chartData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#1c1c1c", borderColor: "#444", color: "#d3d3d3" }}
                labelStyle={{ color: "#d3d3d3" }}
                itemStyle={{ color: "#d3d3d3" }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                wrapperStyle={{ color: "#d3d3d3" }}
              />
            </PieChart>
          </div>
          <div style={{
            flex: 1,
            overflowY: "auto",
            backgroundColor: "rgba(255,255,255,0.08)",
            borderRadius: "12px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px 0 rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            padding: "20px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          }}>
            <AlertList alerts={filteredAlerts} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
