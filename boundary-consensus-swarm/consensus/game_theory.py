import math
from typing import List
from schemas import StakeholderBid, BoundaryVertex, ConsensusResult

class GameTheoryEngine:
    """
    A deterministic game-theoretic negotiation engine for spatial boundary consensus.
    
    DISCLAIMER: This is not a mathematically generalized Nash Equilibrium solver. 
    It is a heuristic MVP approximation inspired by the Nash Bargaining Solution, 
    designed specifically to find a spatial coordinate that maximizes collective 
    utility while preventing any single agent from being completely marginalized.
    """
    
    def __init__(self, max_iterations: int = 100, tolerance: float = 1e-4):
        self.max_iterations = max_iterations
        self.tolerance = tolerance

    def _calculate_distance(self, v1: BoundaryVertex, v2: BoundaryVertex) -> float:
        """Calculates Euclidean distance between two boundary vertices."""
        return math.hypot(v1.x - v2.x, v1.y - v2.y)

    def _calculate_utility(self, bid: StakeholderBid, candidate: BoundaryVertex, max_dist: float) -> float:
        """
        Calculates an agent's utility for a given candidate vertex.
        Utility is directly proportional to their confidence, but decays linearly 
        as the candidate moves further away from their originally proposed vertex.
        """
        dist = self._calculate_distance(bid.proposed_vertex, candidate)
        # Normalize distance relative to the maximum spread of all bids
        norm_dist = dist / max_dist if max_dist > 0 else 0.0
        
        # Utility decays as distance increases. Max utility = confidence_score.
        spatial_discount = max(0.0, 1.0 - norm_dist)
        return bid.confidence_score * spatial_discount

    def run_negotiation(self, bids: List[StakeholderBid]) -> ConsensusResult:
        # Edge case: No bids
        if not bids:
            return ConsensusResult(
                final_vertex=BoundaryVertex(x=0.0, y=0.0, id="no_data"),
                winning_stakeholder=None,
                final_confidence_score=0.0,
                status="failed",
                explanation="Negotiation failed: No stakeholders submitted bids."
            )

        # Edge case: Single bid
        if len(bids) == 1:
            return ConsensusResult(
                final_vertex=bids[0].proposed_vertex,
                winning_stakeholder=bids[0].agent_name,
                final_confidence_score=bids[0].confidence_score,
                status="equilibrium_reached",
                explanation=f"Trivial equilibrium: Only {bids[0].agent_name} submitted a bid."
            )

        # 1. Determine the spatial bounding size (max distance between any two bids)
        max_dist = 0.0
        for b1 in bids:
            for b2 in bids:
                d = self._calculate_distance(b1.proposed_vertex, b2.proposed_vertex)
                if d > max_dist:
                    max_dist = d

        # Edge case: All bids are at the exact same spatial coordinate
        if max_dist == 0.0:
            avg_conf = sum(b.confidence_score for b in bids) / len(bids)
            return ConsensusResult(
                final_vertex=bids[0].proposed_vertex,
                winning_stakeholder=None,
                final_confidence_score=min(1.0, avg_conf),
                status="equilibrium_reached",
                explanation="Immediate equilibrium: All stakeholders proposed the exact same spatial coordinate."
            )

        # 2. Initialize the candidate vertex at the confidence-weighted centroid
        total_confidence = sum(b.confidence_score for b in bids)
        
        # FIX: Edge case where all bids have 0.0 confidence
        if total_confidence == 0.0:
            return ConsensusResult(
                final_vertex=bids[0].proposed_vertex,
                winning_stakeholder=None,
                final_confidence_score=0.0,
                status="stalemate",
                explanation="Stalemate: All stakeholders submitted zero confidence bids. Defaulting to the first proposed vertex."
            )

        current_x = sum(b.proposed_vertex.x * b.confidence_score for b in bids) / total_confidence
        current_y = sum(b.proposed_vertex.y * b.confidence_score for b in bids) / total_confidence
        
        # 3. Iterative Game-Theoretic Negotiation (Nash Bargaining approximation)
        # Agents pull the candidate vertex towards their proposal. 
        # Crucially, agents with LOWER current utility pull proportionally HARDER 
        # to avoid zero-utility scenarios (the threat point of Nash bargaining).
        
        status = "stalemate"
        
        for iteration in range(self.max_iterations):
            candidate = BoundaryVertex(x=current_x, y=current_y)
            
            shift_x, shift_y = 0.0, 0.0
            total_bargaining_weight = 0.0
            
            utilities = []
            
            for bid in bids:
                u = self._calculate_utility(bid, candidate, max_dist)
                utilities.append(u)
                
                # Bargaining Weight: (Confidence / (Utility + epsilon))
                # If an agent is highly confident but currently has low utility, they concede less 
                # and pull harder. This enforces the Nash Product maximization property.
                weight = bid.confidence_score / (u + 0.01)
                
                shift_x += bid.proposed_vertex.x * weight
                shift_y += bid.proposed_vertex.y * weight
                total_bargaining_weight += weight
            
            # Compute new negotiated position
            next_x = shift_x / total_bargaining_weight
            next_y = shift_y / total_bargaining_weight
            
            # Check for stabilization / convergence
            move_dist = math.hypot(next_x - current_x, next_y - current_y)
            if move_dist < self.tolerance:
                status = "equilibrium_reached"
                break
                
            current_x, current_y = next_x, next_y

        # 4. Finalize the Consensus Result
        final_candidate = BoundaryVertex(x=current_x, y=current_y, id="nash_equilibrium_01")
        
        # Final confidence is the average utility of all agents at the equilibrium point
        final_utilities = [self._calculate_utility(b, final_candidate, max_dist) for b in bids]
        avg_utility = sum(final_utilities) / len(final_utilities)
        final_confidence = min(1.0, max(0.0, avg_utility))

        if status == "equilibrium_reached":
            explanation = f"Game-theoretic equilibrium reached after {iteration + 1} iterations. Solution balances spatial utility for all agents."
        else:
            explanation = f"Negotiation hit iteration limit ({self.max_iterations}) without perfect stabilization. Returning best compromised coordinate."

        return ConsensusResult(
            final_vertex=final_candidate,
            winning_stakeholder=None,  # Game theory always results in a collective compromise
            final_confidence_score=final_confidence,
            status=status,
            explanation=explanation
        )
    