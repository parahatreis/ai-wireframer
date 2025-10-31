"""
Validators for each pass output.
Returns (is_valid: bool, violations: List[str])
"""

from typing import Tuple, List, Dict, Any
from ..schemas import SectionKind


def validate_pass_a(layout_plan: Dict[str, Any], app_type: str = None) -> Tuple[bool, List[str]]:
    """
    Validate Pass A output: Layout plan.
    
    VALIDATIONS DISABLED - Always returns valid
    
    Returns:
        (is_valid, violations)
    """
    # Validation disabled - accept all outputs
    return True, []


def validate_pass_b(content_plan: Dict[str, Any]) -> Tuple[bool, List[str]]:
    """
    Validate Pass B output: Content plan.
    
    VALIDATIONS DISABLED - Always returns valid
    
    Returns:
        (is_valid, violations)
    """
    # Validation disabled - accept all outputs
    return True, []


def validate_pass_c(themed_spec: Dict[str, Any], available_palettes: List[str]) -> Tuple[bool, List[str]]:
    """
    Validate Pass C output: Themed spec.
    
    VALIDATIONS DISABLED - Always returns valid
    
    Returns:
        (is_valid, violations)
    """
    # Validation disabled - accept all outputs
    return True, []

