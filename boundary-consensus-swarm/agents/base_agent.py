from abc import ABC, abstractmethod
from typing import Any, Dict
from schemas import BoundaryVertex, StakeholderBid

class BaseAgent(ABC):
    """
    Abstract base class defining the interface for all stakeholder agents.
    """
    def __init__(self, agent_name: str):
        self.agent_name = agent_name

    @abstractmethod
    def evaluate_evidence(self, evidence_data: Dict[str, Any]) -> StakeholderBid:
        """
        Takes in spatial evidence (as a dictionary for this MVP) and 
        returns a structured StakeholderBid containing the proposed vertex.
        """
        pass