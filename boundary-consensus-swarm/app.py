from typing import Dict, Any
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from consensus.orchestrator import ConsensusOrchestrator, OrchestrationResult

app = FastAPI(
    title="Boundary Consensus Swarm API",
    description="Multi-agent spatial negotiation and consensus system.",
    version="1.0.0"
)

# Instantiate the orchestrator once for the application lifecycle
orchestrator = ConsensusOrchestrator()

class ConsensusApiRequest(BaseModel):
    """
    Input model for the API. It binds a specific conflict identifier 
    to the raw evidence data that the agents will evaluate.
    """
    conflict_id: str
    evidence_data: Dict[str, Any]

@app.get("/health")
def health_check():
    """Simple health check endpoint."""
    return {
        "status": "ok",
        "service": "boundary-consensus-swarm"
    }

@app.post("/api/v1/boundary-consensus", response_model=OrchestrationResult)
def boundary_consensus(request: ConsensusApiRequest):
    """
    Executes the multi-agent consensus workflow.
    The agents will process the evidence_data, generate bids, 
    and pass them through the auction and game-theoretic engines.
    """
    try:
        # The orchestrator handles the workflow synchronously and returns an OrchestrationResult
        result = orchestrator.run_workflow(request.evidence_data)
        return result
    except Exception as e:
        # Catch unexpected crashes and return a clean 500 Internal Server Error
        raise HTTPException(status_code=500, detail=f"Consensus orchestration failed: {str(e)}")