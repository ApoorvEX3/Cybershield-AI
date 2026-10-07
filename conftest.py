"""
pytest conftest — sets the Python path so tests can import backend modules.
"""
import sys
import os

# Add backend to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
