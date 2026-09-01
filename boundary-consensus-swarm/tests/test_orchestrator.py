import pytest
import math
from consensus.orchestrator import ConsensusOrchestrator

def get_sample_evidence():
    return {
        "drone_x": 10.0,
        "drone_y": 10.0,
        "drone_confidence": 0.9,
        "cadastral_x": 10.5,
        "cadastral_y": 10.5,
        "cadastral_confidence": 0.8,
        "municipal_x": 10.2,
        "municipal_y": 10.2,
        "municipal_confidence": 0.75
    }

def test_full_workflow():
    """1. Test the complete end-to-end workflow yields exactly 3 bids and valid engines results."""
    orchestrator = ConsensusOrchestrator()
    result = orchestrator.run_workflow(get_sample_evidence())
    
    assert len(result.bids) == 3
    assert result.auction_result is not None
    assert result.final_consensus is not None
    assert result.final_consensus.status in ["equilibrium_reached", "stalemate"]

def test_all_agents_generate_bids():
    """2. Verify that all 3 specific stakeholder agents are present in the bids."""
    orchestrator = ConsensusOrchestrator()
    result = orchestrator.run_workflow(get_sample_evidence())
    
    agent_names = {bid.agent_name for bid in result.bids}
    
    assert "Drone Agent" in agent_names
    assert "Revenue Agent" in agent_names
    assert "Municipal Agent" in agent_names
    assert len(agent_names) == 3

def test_final_consensus_is_game_theory_result():
    """3. Verify final_consensus acts as the independent game theory negotiation."""
    orchestrator = ConsensusOrchestrator()
    # Using differing coordinates so Game Theory yields a compromise (winning_stakeholder = None)
    result = orchestrator.run_workflow(get_sample_evidence())
    
    # In Game Theory with differing positions, there is no single "winning stakeholder"
    assert result.final_consensus.winning_stakeholder is None
    
    assert math.isfinite(result.final_consensus.final_vertex.x)
    assert math.isfinite(result.final_consensus.final_vertex.y)

def test_empty_evidence():
    """4. Empty dictionary should not crash and should use agent defaults."""
    orchestrator = ConsensusOrchestrator()
    result = orchestrator.run_workflow({})
    
    assert len(result.bids) == 3
    assert result.final_consensus is not None
    assert result.auction_result is not None

def test_invalid_evidence_type():
    """5. Non-dictionary evidence (None, string, list) should be handled safely."""
    orchestrator = ConsensusOrchestrator()
    
    # Test None
    res1 = orchestrator.run_workflow(None)
    assert len(res1.bids) == 3
    
    # Test List
    res2 = orchestrator.run_workflow(["invalid", "type"])
    assert len(res2.bids) == 3

def test_deterministic_workflow():
    """6. Two identical runs should yield exactly the same deterministic results."""
    orchestrator = ConsensusOrchestrator()
    evidence = get_sample_evidence()
    
    res1 = orchestrator.run_workflow(evidence)
    res2 = orchestrator.run_workflow(evidence)
    
    # Compare bids
    for b1, b2 in zip(res1.bids, res2.bids):
        assert b1.proposed_vertex.x == b2.proposed_vertex.x
        assert b1.proposed_vertex.y == b2.proposed_vertex.y
        assert b1.confidence_score == b2.confidence_score

    # Compare final consensus coordinates
    assert res1.final_consensus.final_vertex.x == pytest.approx(res2.final_consensus.final_vertex.x)
    assert res1.final_consensus.final_vertex.y == pytest.approx(res2.final_consensus.final_vertex.y)
    
    # Compare status
    assert res1.final_consensus.status == res2.final_consensus.status

def test_confidence_values_propagated():
    """7. Verify specific confidence inputs reach the bids unmodified."""
    orchestrator = ConsensusOrchestrator()
    evidence = {
        "drone_confidence": 0.9,
        "cadastral_confidence": 0.8,
        "municipal_confidence": 0.75
    }
    
    result = orchestrator.run_workflow(evidence)
    
    for bid in result.bids:
        if bid.agent_name == "Drone Agent":
            assert bid.confidence_score == 0.9
        elif bid.agent_name == "Revenue Agent":
            assert bid.confidence_score == 0.8
        elif bid.agent_name == "Municipal Agent":
            assert bid.confidence_score == 0.75

def test_coordinate_values_propagated():
    """8. Verify specific spatial coordinates reach the bids unmodified."""
    orchestrator = ConsensusOrchestrator()
    evidence = {
        "drone_x": 100.0, "drone_y": 200.0,
        "cadastral_x": 300.0, "cadastral_y": 400.0,
        "municipal_x": 500.0, "municipal_y": 600.0
    }
    
    result = orchestrator.run_workflow(evidence)
    
    for bid in result.bids:
        if bid.agent_name == "Drone Agent":
            assert bid.proposed_vertex.x == 100.0
            assert bid.proposed_vertex.y == 200.0
        elif bid.agent_name == "Revenue Agent":
            assert bid.proposed_vertex.x == 300.0
            assert bid.proposed_vertex.y == 400.0
        elif bid.agent_name == "Municipal Agent":
            assert bid.proposed_vertex.x == 500.0
            assert bid.proposed_vertex.y == 600.0

def test_result_model_structure():
    """9. Verify the resulting OrchestrationResult model has expected structure."""
    orchestrator = ConsensusOrchestrator()
    result = orchestrator.run_workflow(get_sample_evidence())
    
    assert hasattr(result, "bids")
    assert hasattr(result, "auction_result")
    assert hasattr(result, "final_consensus")
    assert isinstance(result.bids, list)

def test_final_coordinate_is_finite():
    """10. Ensure the negotiated X and Y are finite floating point numbers."""
    orchestrator = ConsensusOrchestrator()
    result = orchestrator.run_workflow(get_sample_evidence())
    
    assert math.isfinite(result.final_consensus.final_vertex.x)
    assert math.isfinite(result.final_consensus.final_vertex.y)