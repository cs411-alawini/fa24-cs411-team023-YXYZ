from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ecovista.backend.routers.signUp import router as signup_router
from ecovista.backend.routers.info import router as info_router


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

@app.get("/")
async def root():
    return {"message": "Hello CS411 Applications!"}