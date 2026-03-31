"""
Example test file for backend.
Run with: pytest
"""

import pytest
from fastapi.testclient import TestClient


def test_example():
    """Basic sanity check."""
    assert 1 + 1 == 2
