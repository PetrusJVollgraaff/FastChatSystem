from . import *

router = APIRouter(
    prefix="/user",
    tags=["User"]
)

@router.post("/contacts")
def getUserContacts(token: Annotated[str, Form()]):     
    userexist = confirmUserExists(token)
    
    db_session = get_session()
    result = db_session.execute(
                    text(f"""
                         SELECT username, unique_id as id 
                         FROM users
                         WHERE delete_at IS NULL AND
                            username!=:username AND  unique_id!=:uniqueid
                            AND id IN ({userexist["contacts"]})
                         """),
                         {"username": userexist["name"], "uniqueid": userexist["id"]}
                )
    
    
    results = result.mappings().all()
    results
    return {"status": "success", "contacts":results}

@router.post("/addcontact")
def getUserContacts(token: Annotated[str, Form()], username: Annotated[str, Form()], userid: Annotated[str, Form()]): 
    
    userexist = confirmUserExists(token)
    db_session = get_session()

    contactuserexist = findUserByNameAndUniqueID(db_session, username, userid)

    if not contactuserexist:
        raise HTTPException(status_code=404, detail="Not Found")
    
    contacts = userexist["contacts"].split(",")
    
    contact = OneOnOne(receiver_id=contactuserexist["id"])
    connectioncheck = contact.check_exists(db_session, sender_id=userexist["id"], receiver_id=contactuserexist["unique_id"])

    print(connectioncheck)
    if not str(contactuserexist["id"]) in contacts:
        contacts.append(str(contactuserexist["id"]))
        newcontacts = ','.join(contacts)

        

        print("hello",  {"senderid": userexist["db_id"], "newcontacts": newcontacts})
        db_session.execute(
                    text("""
                         UPDATE users SET contacts=:newcontacts
                         WHERE id=:senderid
                         """),
                    {"senderid": userexist["db_id"], "newcontacts": newcontacts}
                )
        db_session.commit()

    return {"status": "success", "message":connectioncheck["connection"]}
    