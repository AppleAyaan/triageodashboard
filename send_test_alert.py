import requests

alerts = [
    {"summary":"Multiple SQL injection attempts","severity":"Critical","category":"injection","recommended_actions":["Block IP","Patch SQL endpoint"],"evidence":["GET /search?q=' OR 1=1 --"]},
    {"summary":"Failed login burst","severity":"High","category":"auth","recommended_actions":["Enable MFA","Lock account"],"evidence":["Failed login x20 from 203.0.113.7"]},
    {"summary":"Suspicious path access","severity":"Medium","category":"misconfig","recommended_actions":["Check server logs","Verify configs"],"evidence":["Accessed /admin and /phpmyadmin"]},
    {"summary":"Minor failed login","severity":"Low","category":"auth","recommended_actions":["Monitor logs"],"evidence":["Single failed login attempt"]}
]

for alert in alerts:
    resp = requests.post("http://localhost:5001/alerts", json=alert)
    print(resp.status_code, resp.text)