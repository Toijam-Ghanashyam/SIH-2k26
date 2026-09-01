import pytest
from pydantic import ValidationError
from schemas import StakeholderBid, BoundaryVertex
from consensus.auction import AuctionEngine

def test_no_bids():
    """1. No bids should return status='failed' and confidence 0."""
    engine = AuctionEngine()
    result = engine.run_auction([])
    
    assert result.status == "failed"
    assert result.final_confidence_score == 0.0
    assert result.final_vertex.x == 0.0
    assert result.final_vertex.y == 0.0

def test_single_bid():
    """2. Single bid should resolve successfully matching the exact bid."""
    engine = AuctionEngine()
    v = BoundaryVertex(x=15.0, y=25.0)
    bid = StakeholderBid(agent_name="Drone", proposed_vertex=v, confidence_score=0.8)
    
    result = engine.run_auction([bid])
    
    assert result.status == "resolved"
    assert result.final_vertex.x == 15.0
    assert result.final_vertex.y == 25.0
    assert result.final_confidence_score == 0.8
    assert result.winning_stakeholder == "Drone"

def test_multiple_bids_same_coordinate():
    """3. Multiple bids at exactly the same coordinate should form one cluster with collective support."""
    engine = AuctionEngine()
    v1 = BoundaryVertex(x=10.0, y=10.0)
    v2 = BoundaryVertex(x=10.0, y=10.0)
    
    b1 = StakeholderBid(agent_name="Revenue", proposed_vertex=v1, confidence_score=0.4)
    b2 = StakeholderBid(agent_name="Municipal", proposed_vertex=v2, confidence_score=0.5)
    
    result = engine.run_auction([b1, b2])
    
    assert result.final_vertex.x == 10.0
    assert result.final_vertex.y == 10.0
    assert result.final_confidence_score == 0.9 # (0.4 + 0.5)
    assert result.winning_stakeholder is None # Compromise / collective win

def test_multiple_bids_within_tolerance():
    """4. Multiple bids within tolerance should cluster and produce a weighted average."""
    engine = AuctionEngine(spatial_tolerance=0.01)
    
    b1 = StakeholderBid(agent_name="Drone", proposed_vertex=BoundaryVertex(x=10.0, y=10.0), confidence_score=0.6)
    b2 = StakeholderBid(agent_name="Revenue", proposed_vertex=BoundaryVertex(x=10.005, y=10.0), confidence_score=0.4)
    
    result = engine.run_auction([b1, b2])
    
    # Weighted avg X: (10.0 * 0.6 + 10.005 * 0.4) / 1.0 = (6.0 + 4.002) = 10.002
    assert result.final_vertex.x == pytest.approx(10.002)
    assert result.final_vertex.y == 10.0
    assert result.final_confidence_score == 1.0 # (0.6 + 0.4)
    assert "Collective consensus reached" in result.explanation

def test_multiple_bids_outside_tolerance():
    """5. Multiple bids outside tolerance should remain separate, strongest wins."""
    engine = AuctionEngine(spatial_tolerance=0.01)
    
    b1 = StakeholderBid(agent_name="Drone", proposed_vertex=BoundaryVertex(x=10.0, y=10.0), confidence_score=0.9)
    b2 = StakeholderBid(agent_name="Revenue", proposed_vertex=BoundaryVertex(x=20.0, y=20.0), confidence_score=0.8)
    
    result = engine.run_auction([b1, b2])
    
    assert result.final_vertex.x == 10.0
    assert result.final_vertex.y == 10.0
    assert result.winning_stakeholder == "Drone"
    assert result.final_confidence_score == 0.9

def test_collective_support_beats_single_high_confidence():
    """6. Collective support (0.8 + 0.75 = 1.55) should beat single high-confidence bid (0.90)."""
    engine = AuctionEngine(spatial_tolerance=0.01)
    
    b1 = StakeholderBid(agent_name="Drone", proposed_vertex=BoundaryVertex(x=10.0, y=10.0), confidence_score=0.90)
    b2 = StakeholderBid(agent_name="Revenue", proposed_vertex=BoundaryVertex(x=20.0, y=20.0), confidence_score=0.80)
    b3 = StakeholderBid(agent_name="Municipal", proposed_vertex=BoundaryVertex(x=20.005, y=20.0), confidence_score=0.75)
    
    result = engine.run_auction([b1, b2, b3])
    
    # B2 and B3 form the winning cluster
    expected_x = (20.0 * 0.80 + 20.005 * 0.75) / 1.55
    assert result.final_vertex.x == pytest.approx(expected_x)
    assert result.final_vertex.y == 20.0
    # Final confidence maxes at 1.0
    assert result.final_confidence_score == 1.0
    assert result.winning_stakeholder is None

def test_tie_in_total_support():
    """7. Tie in total support should use the deterministic tie-breaker (single highest confidence)."""
    engine = AuctionEngine(spatial_tolerance=0.01)
    
    # Cluster 1: Total support 0.80 (Max single = 0.80)
    b1 = StakeholderBid(agent_name="A1", proposed_vertex=BoundaryVertex(x=10.0, y=10.0), confidence_score=0.80)
    
    # Cluster 2: Total support 0.80 (Max single = 0.50)
    b2 = StakeholderBid(agent_name="A2", proposed_vertex=BoundaryVertex(x=20.0, y=20.0), confidence_score=0.50)
    b3 = StakeholderBid(agent_name="A3", proposed_vertex=BoundaryVertex(x=20.005, y=20.0), confidence_score=0.30)
    
    # Feed out of order to ensure tie-breaker logic handles it properly
    result = engine.run_auction([b2, b3, b1])
    
    # Cluster 1 wins because 0.80 max > 0.50 max
    assert result.final_vertex.x == 10.0
    assert result.final_vertex.y == 10.0
    assert result.winning_stakeholder == "A1"

def test_zero_confidence_bids():
    """8. Zero-confidence bids should not cause division-by-zero errors."""
    engine = AuctionEngine(spatial_tolerance=0.01)
    
    b1 = StakeholderBid(agent_name="A1", proposed_vertex=BoundaryVertex(x=5.0, y=5.0), confidence_score=0.0)
    b2 = StakeholderBid(agent_name="A2", proposed_vertex=BoundaryVertex(x=5.001, y=5.0), confidence_score=0.0)
    
    result = engine.run_auction([b1, b2])
    
    # Should safely fallback to the coordinates of the first bid in the cluster
    assert result.final_vertex.x == 5.0
    assert result.final_vertex.y == 5.0
    assert result.final_confidence_score == 0.0

def test_confidence_validation():
    """9. Invalid confidence values (<0 or >1) should be rejected by Pydantic."""
    v = BoundaryVertex(x=0.0, y=0.0)
    
    with pytest.raises(ValidationError):
        StakeholderBid(agent_name="A1", proposed_vertex=v, confidence_score=1.1)
        
    with pytest.raises(ValidationError):
        StakeholderBid(agent_name="A1", proposed_vertex=v, confidence_score=-0.1)

def test_weighted_average_correctness():
    """10. Verify resulting X and Y coordinates mathematically."""
    engine = AuctionEngine(spatial_tolerance=0.5)
    
    b1 = StakeholderBid(agent_name="A1", proposed_vertex=BoundaryVertex(x=0.0, y=0.0), confidence_score=0.2)
    b2 = StakeholderBid(agent_name="A2", proposed_vertex=BoundaryVertex(x=0.2, y=0.4), confidence_score=0.8)
    
    # Total support = 1.0
    # Weighted X = (0.0*0.2 + 0.2*0.8) / 1.0 = 0.16
    # Weighted Y = (0.0*0.2 + 0.4*0.8) / 1.0 = 0.32
    
    result = engine.run_auction([b1, b2])
    
    assert result.final_vertex.x == pytest.approx(0.16)
    assert result.final_vertex.y == pytest.approx(0.32)