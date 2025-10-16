from . import *

router = APIRouter(
    prefix="/search",
    tags=["Search"]
)

@router.post("/")
def getsearhuser(token: Annotated[str, Form()]): 
    
    if not token:
        raise HTTPException(status_code=404, detail="Not Found")
    
    userexist = userAccountExists(token)
    
    if not userexist["status"]:
        raise HTTPException(status_code=401, detail="Unauthized")
    
    db_session = get_session()
    result = db_session.execute(
                    text("""
                         SELECT username, unique_id as id 
                         FROM users
                         WHERE delete_at IS NULL AND
                            username!=:username AND  unique_id!=:uniqueid
                         """),
                         {"username": userexist["name"], "uniqueid": userexist["id"] }
                )
    
    
    results = result.mappings().all()
    results
    return {"status": "success", "search":results}
    