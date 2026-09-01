from typing import Dict, Any, List, Optional
from pydantic import BaseModel
from schemas import StakeholderBid, ConsensusResult, BoundaryVertex
from agents import DroneAgent, RevenueAgent, MunicipalAgent
from consensus.auction import AuctionEngine
from consensus.game_theory import GameTheoryEngine

class OrchestrationResult(BaseModel):
    """
    Pydantic model representing the complete lifecycle output of the consensus workflow.
    """
    bids: List[StakeholderBid]
    auction_result: Optional[ConsensusResult]
    final_consensus: Optional[ConsensusResult]

class ConsensusOrchestrator:
    """
    Coordinates the multi-agent workflow:
    1. Instantiates the stakeholder agents.
    2. Feeds them raw evidence to generate bids.
    3. Runs the AuctionEngine (for comparative/clustering insights).
    4. Runs the GameTheoryEngine (for the final negotiated compromise).
    """
    def __init__(self):
        self.auction_engine = AuctionEngine()
        self.game_theory_engine = GameTheoryEngine()

    def run_workflow(self, evidence_data: Dict[str, Any]) -> OrchestrationResult:
        # 1. Safely handle empty or invalid input
        if evidence_data is None or not isinstance(evidence_data, dict):
            evidence_data = {}

        # 2. Instantiate agents
        agents = [
            DroneAgent(),
            RevenueAgent(),
            MunicipalAgent()
        ]

        # 3. Collect Bids safely
        bids: List[StakeholderBid] = []
        for agent in agents:
            try:
                bid = agent.evaluate_evidence(evidence_data)
                bids.append(bid)
            except Exception as e:
                # Log error and continue so one failing agent doesn't crash the swarm
                print(f"Warning: {agent.agent_name} failed to evaluate evidence. Error: {e}")

        # Fallback response if an engine crashes unexpectedly
        fallback_res = ConsensusResult(
            final_vertex=BoundaryVertex(x=0.0, y=0.0, id="error_fallback"),
            winning_stakeholder=None,
            final_confidence_score=0.0,
            status="failed",
            explanation="Engine execution failed unexpectedly."
        )

        # 4 & 5. Run Auction Engine
        try:
            auction_res = self.auction_engine.run_auction(bids)
        except Exception as e:
            print(f"Warning: AuctionEngine failed. Error: {e}")
            auction_res = fallback_res

        # 6 & 7. Run Game Theory Engine (This acts as the final decision layer)
        try:
            game_theory_res = self.game_theory_engine.run_negotiation(bids)
        except Exception as e:
            print(f"Warning: GameTheoryEngine failed. Error: {e}")
            game_theory_res = fallback_res

        # 8. Return structured result
        return OrchestrationResult(
            bids=bids,
            auction_result=auction_res,
            final_consensus=game_theory_res
        )