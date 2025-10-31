"""
Deterministic seed generation for reproducible outputs.
Seed = hash(prompt + options + schema_version)
"""

import hashlib
import json
from typing import Dict, Any


def generate_seed(prompt: str, options: Dict[str, Any], schema_version: str) -> int:
    """
    Generate deterministic seed from prompt, options, and schema version.
    Same inputs will always produce the same seed.
    
    Args:
        prompt: User's input prompt
        options: Additional options dict
        schema_version: Schema version string (e.g., "1.0.0")
    
    Returns:
        Integer seed for LLM and random choices
    """
    # Normalize inputs
    prompt_normalized = prompt.strip().lower()
    
    # Sort options dict for consistency
    options_normalized = json.dumps(options, sort_keys=True) if options else "{}"
    
    # Combine all inputs
    combined = f"{prompt_normalized}|{options_normalized}|{schema_version}"
    
    # Hash to bytes
    hash_bytes = hashlib.sha256(combined.encode('utf-8')).digest()
    
    # Convert first 8 bytes to integer (for seed)
    seed = int.from_bytes(hash_bytes[:8], byteorder='big')
    
    # Ensure seed is within reasonable range for most LLM APIs
    # Most APIs accept seeds in range [0, 2^32-1] or [0, 2^63-1]
    seed = seed % (2**31 - 1)  # Keep it positive and within int32 range
    
    return seed


def seed_for_pass(base_seed: int, pass_name: str) -> int:
    """
    Generate a deterministic sub-seed for a specific pass.
    This allows each pass to have reproducible but different randomness.
    
    Args:
        base_seed: Base seed from generate_seed()
        pass_name: Name of the pass (e.g., "pass_a", "pass_b", "pass_c")
    
    Returns:
        Integer seed for this specific pass
    """
    combined = f"{base_seed}|{pass_name}"
    hash_bytes = hashlib.sha256(combined.encode('utf-8')).digest()
    sub_seed = int.from_bytes(hash_bytes[:8], byteorder='big')
    sub_seed = sub_seed % (2**31 - 1)
    return sub_seed


def seed_for_candidate(base_seed: int, candidate_index: int) -> int:
    """
    Generate a deterministic sub-seed for a specific candidate in Pass C.
    Allows multiple themed variations while maintaining determinism.
    
    Args:
        base_seed: Base seed for Pass C
        candidate_index: Index of this candidate (0, 1, 2, 3)
    
    Returns:
        Integer seed for this candidate
    """
    combined = f"{base_seed}|candidate_{candidate_index}"
    hash_bytes = hashlib.sha256(combined.encode('utf-8')).digest()
    sub_seed = int.from_bytes(hash_bytes[:8], byteorder='big')
    sub_seed = sub_seed % (2**31 - 1)
    return sub_seed

