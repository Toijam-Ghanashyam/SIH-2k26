# Boundary Consensus Swarm

A multi-agent spatial boundary conflict resolution system where Drone, Revenue/Cadastral, and Municipal agents evaluate evidence, submit confidence-based bids, and participate in an auction and game-theoretic consensus workflow.

## 🧠 Key Components

- **Drone Agent**: Represents remote-sensing/high-resolution visual evidence.
- **Revenue Agent**: Represents legacy cadastral and historical land records.
- **Municipal Agent**: Represents town-planning and utility maps.
- **Auction Engine**: Clusters nearby bids and evaluates collective confidence support.
- **Game Theory Engine**: Negotiates a final compromise based on spatial utility and bargaining power.
- **Consensus Orchestrator**: Synchronous pipeline coordinating agents and consensus engines.
- **FastAPI REST API**: Exposes the orchestrator through a clean API layer.

## 🔄 Workflow

**Evidence → Agents → Confidence Bids → Auction → Game-Theoretic Negotiation → Final Consensus**

> **Note on Game Theory:** The `GameTheoryEngine` uses a deterministic heuristic inspired by the **Nash Bargaining Solution** to balance spatial utility among agents. It is an MVP approximation and is **NOT** a formal, mathematically generalized Nash Equilibrium solver.

## 🚀 API Endpoints

FastAPI automatically provides interactive Swagger documentation at `/docs` and `/redoc`.

### `GET /health`
Returns the operational status of the service.

### `POST /api/v1/boundary-consensus`
Executes the full multi-agent consensus workflow for a specific boundary conflict.

**Example Request:**
```json
{
  "conflict_id": "conflict_test_001",
  "evidence_data": {
    "drone_x": 10.0,
    "drone_y": 10.0,
    "drone_confidence": 0.90,
    "cadastral_x": 10.5,
    "cadastral_y": 10.5,
    "cadastral_confidence": 0.80,
    "municipal_x": 10.2,
    "municipal_y": 10.2,
    "municipal_confidence": 0.75
  }
}