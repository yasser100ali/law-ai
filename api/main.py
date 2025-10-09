"""
Vercel handler for FastAPI app.
This file exports the FastAPI app so Vercel can run it as a serverless function.
"""
from .index import app

# Vercel looks for a variable named 'app' or 'handler'
# We're exporting the FastAPI app from index.py
__all__ = ["app"]

