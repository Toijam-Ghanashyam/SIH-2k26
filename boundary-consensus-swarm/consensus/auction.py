import math
from typing import List
from schemas import StakeholderBid, ConsensusResult, BoundaryVertex

class AuctionEngine:
    """
    A programmatic auction engine that determines the strongest boundary vertex candidate
    based on a confidence-weighted spatial clustering approach.
    """
    def __init__(self, spatial_tolerance: float = 0.001):
        # The maximum Euclidean distance for two bids to be considered referring to the "same" point
        self.spatial_tolerance = spatial_tolerance

    def _calculate_distance(self, v1: BoundaryVertex, v2: BoundaryVertex) -> float:
        """Calculates Euclidean distance between two boundary vertices."""
        return math.hypot(v1.x - v2.x, v1.y - v2.y)

    def run_auction(self, bids: List[StakeholderBid]) -> ConsensusResult:
        if not bids:
            # Handle the zero bids edge case
            return ConsensusResult(
                final_vertex=BoundaryVertex(x=0.0, y=0.0, id="no_data"),
                winning_stakeholder=None,
                final_confidence_score=0.0,
                status="failed",
                explanation="Auction failed: No bids were submitted."
            )

        # Cluster the bids based on spatial tolerance
        # Each cluster is a list of StakeholderBids
        clusters: List[List[StakeholderBid]] = []

        for bid in bids:
            added_to_cluster = False
            for cluster in clusters:
                # Compare distance to the first bid in the existing cluster
                reference_vertex = cluster[0].proposed_vertex
                dist = self._calculate_distance(bid.proposed_vertex, reference_vertex)
                
                if dist <= self.spatial_tolerance:
                    cluster.append(bid)
                    added_to_cluster = True
                    break
            
            if not added_to_cluster:
                clusters.append([bid])

        # Evaluate support for each cluster
        best_cluster = []
        max_support = -1.0

        for cluster in clusters:
            # Collective support is the sum of confidence scores in this cluster
            support = sum(b.confidence_score for b in cluster)
            
            if support > max_support:
                max_support = support
                best_cluster = cluster
            elif support == max_support:
                # Deterministic Tie-Breaker: pick the cluster containing the single highest confidence score
                current_best_max = max(b.confidence_score for b in best_cluster)
                new_cluster_max = max(b.confidence_score for b in cluster)
                if new_cluster_max > current_best_max:
                    best_cluster = cluster

        # Compute the final consensus vertex (Weighted average of the winning cluster)
        total_x = sum(b.proposed_vertex.x * b.confidence_score for b in best_cluster)
        total_y = sum(b.proposed_vertex.y * b.confidence_score for b in best_cluster)
        
        # Guard against zero-confidence division (edge case)
        if max_support > 0:
            consensus_x = total_x / max_support
            consensus_y = total_y / max_support
        else:
            consensus_x = best_cluster[0].proposed_vertex.x
            consensus_y = best_cluster[0].proposed_vertex.y

        final_vertex = BoundaryVertex(
            x=consensus_x, 
            y=consensus_y, 
            id="consensus_vertex_01"
        )

        # Generate contextual explanation and metadata
        if len(best_cluster) == 1:
            winning_agent = best_cluster[0].agent_name
            explanation = f"Single highest bidder won. Agent '{winning_agent}' secured the boundary with {max_support:.2f} support."
        else:
            winning_agent = None  # None indicates a compromise was computed
            agent_names = [b.agent_name for b in best_cluster]
            explanation = f"Collective consensus reached. Agents {', '.join(agent_names)} joined forces for a total support of {max_support:.2f}. The result is a weighted spatial compromise."

        return ConsensusResult(
            final_vertex=final_vertex,
            winning_stakeholder=winning_agent,
            # Per schema rules, confidence strictly between 0 and 1
            final_confidence_score=min(1.0, max_support),
            status="resolved",
            explanation=explanation
        )