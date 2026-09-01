import pytest
from fastapi.testclient import TestClient
from app import app

# Create the test client
client = TestClient(app)

def test_health():
    """Verify the health endpoint returns 200 OK and expected JSON."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {
        "status": "ok", 
        "service": "boundary-consensus-swarm"
    }

def test_boundary_consensus_success():
    """Verify a valid request processes through the agents and returns full consensus data."""
    payload = {
        "conflict_id": "conflict_test_001",
        "evidence_data": {
            "drone_x": 10.0,
            "drone_y": 10.0,
            "drone_confidence": 0.9,
            "cadastral_x": 10.5,
            "cadastral_y": 10.5,
            "cadastral_confidence": 0.8,
            "municipal_x": 10.2,
            "municipal_y": 10.2,
            "municipal_confidence": 0.75
        }
    }
    
    response = client.post("/api/v1/boundary-consensus", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    
    # Check that all keys from OrchestrationResult are present
    assert "bids" in data
    assert "auction_result" in data
    assert "final_consensus" in data
    
    # Validate core behavior mapped through the API
    assert len(data["bids"]) == 3
    assert data["final_consensus"]["status"] in ["equilibrium_reached", "stalemate"]
    assert data["auction_result"]["status"] == "resolved"

def test_boundary_consensus_empty_evidence():
    """Verify the endpoint still processes cleanly when evidence is an empty dictionary."""
    payload = {
        "conflict_id": "conflict_test_002",
        "evidence_data": {}
    }
    
    response = client.post("/api/v1/boundary-consensus", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert len(data["bids"]) == 3
    assert "final_consensus" in data

def test_boundary_consensus_invalid_request():
    """Verify FastAPI automatically returns 422 Validation Error for missing required fields."""
    # Missing both conflict_id and evidence_data
    response = client.post("/api/v1/boundary-consensus", json={"wrong_key": "data"})
    assert response.status_code == 422
    
    # Missing evidence_data
    response2 = client.post("/api/v1/boundary-consensus", json={"conflict_id": "conflict_123"})
    assert response2.status_code == 422

def test_boundary_consensus_invalid_evidence_type():
    """Verify FastAPI automatically returns 422 if evidence_data is not a dictionary."""
    payload = {
        "conflict_id": "conflict_test_003",
        "evidence_data": "this_should_be_a_dict"
    }
    
    response = client.post("/api/v1/boundary-consensus", json=payload)
    assert response.status_code == 422