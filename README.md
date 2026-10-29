# Customer Relationship Management (CRM) System

**Student Roll Number:** 24MIS0407  
**Project:** CRM (Customer Relationship Management)  
**Author:** Niranjan S  
**GitHub Repository:** [crm-app-24MIS0407](https://github.com/NiranjanS1812/crm-app-24MIS0407)  
**DockerHub Repository:** [niranjans1822/crm-app](https://hub.docker.com/r/niranjans1822/crm-app)

---

## 📌 Project Overview
A lightweight, modern full-stack CRM web application built using **Node.js + Express** with in-memory persistence and a responsive web UI. The application is developed iteratively across three releases (**v1**, **v2**, and **v3**) and deployed through an automated **Jenkins CI/CD pipeline** into **Docker** and **Kubernetes**.

---

## 🚀 Features Per Version

### **Version 1 (`v1`) - Add Customer**
- **Endpoint:** `POST /customers`
- **Fields:** `id`, `name`, `phone`, `email`, `company`
- **UI:** Interactive form to input and store customer details.
- **Health Check:** `GET /health` returning `{ status: "UP", version: "v1" }`.
- **Smoke Tests:** Automated verification of health endpoint and customer insertion.

### **Version 2 (`v2`) - View Customers**
- **Endpoint:** `GET /customers`
- **UI:** Responsive data table displaying all registered customers with IDs, contact info, and company.
- **Auto-Refresh:** Table dynamically refreshes upon adding a new record.
- **Smoke Tests:** Automated validation for customer listing and retrieval.

### **Version 3 (`v3`) - Update Customer**
- **Endpoint:** `PUT /customers/:id`
- **UI:** In-line editing modal allowing updates to name, phone, email, and company with real-time UI refresh.
- **Health Check:** `GET /health` returning `{ status: "UP", version: "v3" }`.
- **Smoke Tests:** Automated validation for updating customer records by ID.

---

## 🛠️ How to Run Locally

### 1. Prerequisites
- Node.js LTS (v18+)
- npm (v9+)

### 2. Installation
```bash
npm install
```

### 3. Run Tests
```bash
npm test
```

### 4. Start the Application
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🐳 Running with Docker

### Build Image
```bash
docker build -t niranjans1822/crm-app:v1 .
```

### Run Container
```bash
docker run -d -p 3000:3000 --name crm-app niranjans1822/crm-app:v1
```

### Health Check
```bash
curl http://localhost:3000/health
```

---

## ☸️ Running on Kubernetes

Deploy all three versions side-by-side:
```bash
kubectl apply -f k8s/
```

Access services via port forwarding:
```bash
# v1
kubectl port-forward svc/crm-v1 30001:80

# v2
kubectl port-forward svc/crm-v2 30002:80

# v3
kubectl port-forward svc/crm-v3 30003:80
```
- **v1:** [http://localhost:30001](http://localhost:30001)
- **v2:** [http://localhost:30002](http://localhost:30002)
- **v3:** [http://localhost:30003](http://localhost:30003)
