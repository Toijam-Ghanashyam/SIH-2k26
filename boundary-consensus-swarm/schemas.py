from typing import List, Optional
from pydantic import BaseModel, Field

class BoundaryVertex(BaseModel):
    """
    Represents a single 2D spatial coordinate for a boundary point.
    """
    x: float = Field(..., description="The X coordinate (e.g., longitude or local grid X)")
    y: float = Field(..., description="The Y coordinate (e.g., latitude or local grid Y)")
    id: Optional[str] = Field(default=None, description="Optional identifier for this specific vertex")


class StakeholderBid(BaseModel):
    """
    Represents a proposed vertex submitted by a specific stakeholder agent.
    """
    agent_name: str = Field(..., description="Name of the stakeholder agent (e.g., 'Drone Agent')")
    proposed_vertex: BoundaryVertex
    confidence_score: float = Field(
        ..., 
        ge=0.0, 
        le=1.0, 
        description="Agent's confidence in their proposed vertex, strictly between 0.0 and 1.0"
    )
    evidence: Optional[str] = Field(
        default=None, 
        description="Optional justification or source data"
    )


class ConsensusRequest(BaseModel):
    """
    The input payload that triggers the consensus algorithm.
    """
    conflict_id: str = Field(..., description="Unique identifier for the spatial boundary conflict")
    candidate_vertices: Optional[List[BoundaryVertex]] = Field(
        default=None, 
        description="Optional list of predefined candidate vertices being fought over"
    )
    bids: List[StakeholderBid] = Field(..., description="The collection of bids submitted by the agents")


class ConsensusResult(BaseModel):
    """
    The final output payload produced after the consensus logic executes.
    """
    final_vertex: BoundaryVertex
    winning_stakeholder: Optional[str] = Field(
        default=None, 
        description="The agent whose bid won, or None if the result is a newly computed compromise"
    )
    final_confidence_score: float = Field(
        ..., 
        ge=0.0, 
        le=1.0, 
        description="The aggregated or resulting confidence score of the final consensus"
    )
    status: str = Field(
        ..., 
        description="Current state of the consensus (e.g., 'resolved', 'stalemate', 'failed')"
    )
    explanation: str = Field(
        ..., 
        description="Brief reasoning of how the consensus was reached"
    )