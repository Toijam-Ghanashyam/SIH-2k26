from typing import Any, Dict
from schemas import BoundaryVertex, StakeholderBid
from .base_agent import BaseAgent

class MunicipalAgent(BaseAgent):
    """
    Represents municipal town-planning records and local utility maps.
    Practical and utility-focused, acting as a middle-ground reference.
    """
    def __init__(self, agent_name: str = "Municipal Agent"):
        super().__init__(agent_name)

    def evaluate_evidence(self, evidence_data: Dict[str, Any]) -> StakeholderBid:
        # Deterministic mock logic extracting municipal data
        x = evidence_data.get("municipal_x", 0.0)
        y = evidence_data.get("municipal_y", 0.0)
        confidence = evidence_data.get("municipal_confidence", 0.0)
        
        vertex = BoundaryVertex(x=x, y=y, id="vertex_municipal_01")
        
        return StakeholderBid(
            agent_name=self.agent_name,
            proposed_vertex=vertex,
            confidence_score=confidence,
            evidence="Mock municipal town planning boundary map"
        )