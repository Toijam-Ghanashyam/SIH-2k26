from typing import Any, Dict
from schemas import BoundaryVertex, StakeholderBid
from .base_agent import BaseAgent

class DroneAgent(BaseAgent):
    """
    Represents remote-sensing evidence (e.g., high-resolution orthomosaics).
    Typically yields high confidence but relies entirely on visual surface features.
    """
    def __init__(self, agent_name: str = "Drone Agent"):
        super().__init__(agent_name)

    def evaluate_evidence(self, evidence_data: Dict[str, Any]) -> StakeholderBid:
        # Deterministic mock logic extracting drone-specific data
        x = evidence_data.get("drone_x", 0.0)
        y = evidence_data.get("drone_y", 0.0)
        confidence = evidence_data.get("drone_confidence", 0.0)
        
        vertex = BoundaryVertex(x=x, y=y, id="vertex_drone_01")
        
        return StakeholderBid(
            agent_name=self.agent_name,
            proposed_vertex=vertex,
            confidence_score=confidence,
            evidence="Mock drone orthomosaic spatial analysis"
        )