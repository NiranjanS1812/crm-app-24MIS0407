#!/bin/bash
echo "========================================================"
echo "Starting Kubernetes Port-Forwards for CRM Applications"
echo "Roll Number: 24MIS0407"
echo "========================================================"

killall kubectl 2>/dev/null

kubectl port-forward svc/crm-v1 30001:80 >/dev/null 2>&1 &
kubectl port-forward svc/crm-v2 30002:80 >/dev/null 2>&1 &
kubectl port-forward svc/crm-v3 30003:80 >/dev/null 2>&1 &

sleep 2
echo "All port forwards active:"
echo "  - v1 (Add):     http://localhost:30001"
echo "  - v2 (View):    http://localhost:30002"
echo "  - v3 (Update):  http://localhost:30003"
