"""
LLM client wrapper for LiteLLM with seed support and structured outputs.
"""

import os
import json
from typing import Dict, Any, Optional, List
from litellm import completion


class LLMClient:
    """Wrapper around LiteLLM for deterministic, structured generation"""
    
    def __init__(self, model: Optional[str] = None, use_pro: bool = True):
        """
        Initialize LLM client.
        
        Args:
            model: Model name (overrides env vars if provided)
            use_pro: If True, use AI_MODEL_PRO; if False, use AI_MODEL_LITE
        """
        if model:
            self.model = model
        elif use_pro:
            self.model = os.getenv("AI_MODEL_PRO", "gpt-4o")
        else:
            self.model = os.getenv("AI_MODEL_LITE", "gpt-4o-mini")
    
    def generate(
        self,
        user_prompt: str,
        system_prompt: str,
        temperature: float = 0.0,
        seed: Optional[int] = None,
        response_format: str = "json_object",
        max_tokens: Optional[int] = None,
    ) -> Dict[str, Any]:
        """
        Generate completion with structured output.
        
        Args:
            user_prompt: User's prompt
            system_prompt: System instructions
            temperature: Temperature for generation (0.0 = deterministic)
            seed: Random seed for reproducibility
            response_format: "json_object" for JSON mode
            max_tokens: Maximum tokens to generate
        
        Returns:
            Parsed JSON response
        
        Raises:
            ValueError: If response is not valid JSON
        """
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ]
        
        # Build completion kwargs
        kwargs: Dict[str, Any] = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
        }
        
        # Add seed if provided (for determinism)
        if seed is not None:
            kwargs["seed"] = seed
        
        # Add response format for JSON mode
        if response_format == "json_object":
            kwargs["response_format"] = {"type": "json_object"}
        
        # Add max_tokens if specified
        if max_tokens:
            kwargs["max_tokens"] = max_tokens
        
        # Call LiteLLM
        try:
            response = completion(**kwargs)
        except Exception as e:
            raise ValueError(f"LLM generation failed: {str(e)}")
        
        # Extract content
        content = response.choices[0].message.content
        if not content:
            raise ValueError("Empty response from LLM")
        
        # Parse JSON if requested
        if response_format == "json_object":
            content = self._extract_json(content)
            try:
                return json.loads(content)
            except json.JSONDecodeError as e:
                raise ValueError(f"Invalid JSON response: {str(e)}\nContent: {content[:500]}")
        
        return {"content": content}
    
    def generate_with_repair(
        self,
        user_prompt: str,
        system_prompt: str,
        validator_fn: Any,
        temperature: float = 0.0,
        seed: Optional[int] = None,
        max_repair_attempts: int = 1,
    ) -> Dict[str, Any]:
        """
        Generate with validation and optional repair.
        
        Args:
            user_prompt: User's prompt
            system_prompt: System instructions
            validator_fn: Function that takes output dict and returns (is_valid, violations)
            temperature: Temperature for generation
            seed: Random seed
            max_repair_attempts: Maximum number of repair attempts
        
        Returns:
            Valid output dict
        
        Raises:
            ValueError: If validation fails after all repair attempts
        """
        # Initial generation
        output = self.generate(user_prompt, system_prompt, temperature, seed)
        
        # Validate
        is_valid, violations = validator_fn(output)
        
        if is_valid:
            return output
        
        # Attempt repairs
        for attempt in range(max_repair_attempts):
            print(f"Validation failed, attempting repair {attempt + 1}/{max_repair_attempts}")
            print(f"Violations: {violations}")
            
            # Build repair prompt
            repair_prompt = self._build_repair_prompt(user_prompt, output, violations)
            
            # Generate repair (slightly higher temp for flexibility)
            output = self.generate(
                repair_prompt,
                system_prompt,
                temperature=min(temperature + 0.1, 0.2),
                seed=seed + attempt + 1 if seed else None,
            )
            
            # Re-validate
            is_valid, violations = validator_fn(output)
            
            if is_valid:
                print(f"Repair successful on attempt {attempt + 1}")
                return output
        
        # All repair attempts failed
        raise ValueError(f"Validation failed after {max_repair_attempts} repairs. Violations: {violations}")
    
    def _extract_json(self, content: str) -> str:
        """Extract JSON from markdown code blocks if present"""
        content = content.strip()
        
        # Check for markdown code blocks
        if content.startswith("```"):
            # Remove opening fence
            if content.startswith("```json"):
                content = content[7:]
            elif content.startswith("```"):
                content = content[3:]
            
            # Remove closing fence
            if content.endswith("```"):
                content = content[:-3]
            
            content = content.strip()
        
        return content
    
    def _build_repair_prompt(
        self,
        original_prompt: str,
        failed_output: Dict[str, Any],
        violations: List[str],
    ) -> str:
        """Build a repair prompt with specific violations"""
        violations_text = "\n".join(f"- {v}" for v in violations)
        
        return f"""{original_prompt}

IMPORTANT: Your previous output had validation errors. Fix these specific issues:

{violations_text}

DO NOT make structural changes beyond fixing these violations.
Return the corrected JSON."""

