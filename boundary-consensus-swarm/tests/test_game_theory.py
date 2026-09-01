import pytest
import math
from pydantic import ValidationError
from schemas import StakeholderBid, BoundaryVertex
from consensus.game_theory import GameTheoryEngine

def test_no_bids():
    """1. Empty list should return status='failed' and final_confidence_score=0.0."""
    engine = GameTheoryEngine()
    result = engine.run_negotiation([])
    
    assert result.status == "failed"
    assert result.final_confidence_score == 0.0
    assert result.final_vertex.x == 0.0
    assert result.final_vertex.y == 0.0

def test_single_bid():
    """2. One bid should return the same vertex, with status 'equilibrium_reached'."""
    engine = GameTheoryEngine()
    v = BoundaryVertex(x=15.0, y=25.0)
    bid = StakeholderBid(agent_name="Drone", proposed_vertex=v, confidence_score=0.8)
    
    result = engine.run_negotiation([bid])
    
    assert result.status == "equilibrium_reached"
    assert result.final_vertex.x == 15.0
    assert result.final_vertex.y == 25.0
    assert result.final_confidence_score == 0.8
    assert result.winning_stakeholder == "Drone"

def test_identical_coordinates():
    """3. Multiple agents proposing exactly the same coordinate should immediately reach equilibrium."""
    engine = GameTheoryEngine()
    v1 = BoundaryVertex(x=10.0, y=10.0)
    v2 = BoundaryVertex(x=10.0, y=10.0)
    
    b1 = StakeholderBid(agent_name="Revenue", proposed_vertex=v1, confidence_score=0.4)
    b2 = StakeholderBid(agent_name="Municipal", proposed_vertex=v2, confidence_score=0.5)
    
    result = engine.run_negotiation([b1, b2])
    
    assert result.status == "equilibrium_reached"
    assert result.final_vertex.x == 10.0
    assert result.final_vertex.y == 10.0
    assert result.winning_stakeholder is None

def test_all_zero_confidence():
    """4. Multiple bids with confidence_score=0.0 should not raise ZeroDivisionError."""
    engine = GameTheoryEngine()
    
    b1 = StakeholderBid(agent_name="Drone", proposed_vertex=BoundaryVertex(x=5.0, y=5.0), confidence_score=0.0)
    b2 = StakeholderBid(agent_name="Revenue", proposed_vertex=BoundaryVertex(x=20.0, y=20.0), confidence_score=0.0)
    
    result = engine.run_negotiation([b1, b2])
    
    assert result.status == "stalemate"
    assert result.final_confidence_score == 0.0
    # Should fallback to the first bid's vertex
    assert result.final_vertex.x == 5.0
    assert result.final_vertex.y == 5.0

def test_conflicting_bids():
    """5. Clearly different coordinates should return a valid ConsensusResult."""
    engine = GameTheoryEngine()
    
    b1 = StakeholderBid(agent_name="A1", proposed_vertex=BoundaryVertex(x=0.0, y=0.0), confidence_score=0.9)
    b2 = StakeholderBid(agent_name="A2", proposed_vertex=BoundaryVertex(x=10.0, y=10.0), confidence_score=0.8)
    
    result = engine.run_negotiation([b1, b2])
    
    assert result.status in ["equilibrium_reached", "stalemate"]
    assert math.isfinite(result.final_vertex.x)
    assert math.isfinite(result.final_vertex.y)

def test_high_confidence_influence():
    """6. Final point should be closer to the high-confidence proposal."""
    engine = GameTheoryEngine()
    
    # Drone has high confidence, Revenue has very low confidence
    b_high = StakeholderBid(agent_name="Drone", proposed_vertex=BoundaryVertex(x=0.0, y=0.0), confidence_score=0.95)
    b_low = StakeholderBid(agent_name="Revenue", proposed_vertex=BoundaryVertex(x=10.0, y=10.0), confidence_score=0.10)
    
    result = engine.run_negotiation([b_high, b_low])
    
    dist_to_high = math.hypot(result.final_vertex.x - b_high.proposed_vertex.x, result.final_vertex.y - b_high.proposed_vertex.y)
    dist_to_low = math.hypot(result.final_vertex.x - b_low.proposed_vertex.x, result.final_vertex.y - b_low.proposed_vertex.y)
    
    assert dist_to_high < dist_to_low

def test_multiple_agents():
    """7. Test with all three stakeholder types to ensure collective negotiation works."""
    engine = GameTheoryEngine()
    
    b1 = StakeholderBid(agent_name="Drone Agent", proposed_vertex=BoundaryVertex(x=10.0, y=10.0), confidence_score=0.9)
    b2 = StakeholderBid(agent_name="Revenue Agent", proposed_vertex=BoundaryVertex(x=20.0, y=20.0), confidence_score=0.8)
    b3 = StakeholderBid(agent_name="Municipal Agent", proposed_vertex=BoundaryVertex(x=20.005, y=20.0), confidence_score=0.75)
    
    result = engine.run_negotiation([b1, b2, b3])
    
    assert result.status in ["equilibrium_reached", "stalemate"]
    assert result.winning_stakeholder is None

def test_convergence():
    """8. Running the same bids twice should yield deterministic identical results."""
    engine = GameTheoryEngine()
    
    bids = [
        StakeholderBid(agent_name="Drone", proposed_vertex=BoundaryVertex(x=10.0, y=10.0), confidence_score=0.9),
        StakeholderBid(agent_name="Revenue", proposed_vertex=BoundaryVertex(x=15.0, y=25.0), confidence_score=0.7)
    ]
    
    result1 = engine.run_negotiation(bids)
    result2 = engine.run_negotiation(bids)
    
    assert result1.status == result2.status
    assert result1.final_vertex.x == pytest.approx(result2.final_vertex.x)
    assert result1.final_vertex.y == pytest.approx(result2.final_vertex.y)

def test_confidence_bounds():
    """9. final_confidence_score must remain between 0.0 and 1.0 inclusive."""
    engine = GameTheoryEngine()
    
    b1 = StakeholderBid(agent_name="A1", proposed_vertex=BoundaryVertex(x=0.0, y=0.0), confidence_score=0.99)
    b2 = StakeholderBid(agent_name="A2", proposed_vertex=BoundaryVertex(x=100.0, y=100.0), confidence_score=0.99)
    
    result = engine.run_negotiation([b1, b2])
    
    assert 0.0 <= result.final_confidence_score <= 1.0

def test_invalid_confidence():
    """10. Pydantic should reject invalid confidence_scores < 0.0 or > 1.0."""
    v = BoundaryVertex(x=0.0, y=0.0)
    
    with pytest.raises(ValidationError):
        StakeholderBid(agent_name="A1", proposed_vertex=v, confidence_score=1.5)
        
    with pytest.raises(ValidationError):
        StakeholderBid(agent_name="A1", proposed_vertex=v, confidence_score=-0.5)