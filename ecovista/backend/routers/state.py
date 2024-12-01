from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
import pymysql
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from utils import db_config

router = APIRouter()

@router.get("/state")
async def get_state_data(state_name: str):
    print("\n=== State Click ===")
    print(f"State Name: {state_name}")
    print("==================\n")
    return {"message": "State logged successfully"}