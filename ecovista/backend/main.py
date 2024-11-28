from fastapi import FastAPI, Response, status
from fastapi.middleware.cors import CORSMiddleware
from routers.signUp import router as signup_router
from routers.info import router as info_router
from routers.profile import router as profile_router


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
app.include_router(profile_router)

@app.get("/")
async def root():
    return {"message": "Hello CS411 Applications!"}

@app.post("/logout", status_code=status.HTTP_200_OK)
async def logout(response: Response):
    response.delete_cookie(key="user_session")
    return {"success": True, "message": "Logged out successfully."}