@echo off
echo ========================================================
echo Starting Kubernetes Port-Forwards for CRM Applications
echo Roll Number: 24MIS0407
echo ========================================================

echo Stopping existing port forwards...
taskkill /F /IM kubectl.exe >nul 2>&1

echo Starting port-forward for crm-v1 on port 30001...
start "CRM-v1" /MIN kubectl port-forward svc/crm-v1 30001:80

echo Starting port-forward for crm-v2 on port 30002...
start "CRM-v2" /MIN kubectl port-forward svc/crm-v2 30002:80

echo Starting port-forward for crm-v3 on port 30003...
start "CRM-v3" /MIN kubectl port-forward svc/crm-v3 30003:80

timeout /t 3 /nobreak >nul

echo.
echo ========================================================
echo All port forwards active:
echo   - v1 (Add):     http://localhost:30001
echo   - v2 (View):    http://localhost:30002
echo   - v3 (Update):  http://localhost:30003
echo ========================================================
pause
