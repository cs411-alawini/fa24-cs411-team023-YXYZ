from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from signUp import router as signup_router
from info import router as info_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(signup_router)
app.include_router(info_router)
