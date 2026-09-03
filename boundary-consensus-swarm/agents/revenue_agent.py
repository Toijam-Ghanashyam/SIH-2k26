from typing import Any, Dict
from schemas import BoundaryVertex, StakeholderBid
from .base_agent import BaseAgent

class RevenueAgent(BaseAgent):
    """
    Represents legacy land records and cadastral maps. 
    Strong legal standing but may have spatial drift due to old surveying methods.
    """
    def __init__(self, agent_name: str = "Revenue Agent"):
        super().__init__(agent_name)

    def evaluate_evidence(self, evidence_data: Dict[str, Any]) -> StakeholderBid:
        # Deterministic mock logic extracting cadastral data
        x = evidence_data.get("cadastral_x", 0.0)
        y = evidence_data.get("cadastral_y", 0.0)
        confidence = evidence_data.get("cadastral_confidence", 0.0)
        
        vertex = BoundaryVertex(x=x, y=y, id="vertex_revenue_01")
        
        return StakeholderBid(
            agent_name=self.agent_name,
            proposed_vertex=vertex,
            confidence_score=confidence,
            evidence="Mock historical cadastral record match"
        )