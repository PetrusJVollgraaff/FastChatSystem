
from ...models.usersModel import get_User_ID
from . import *

router = APIRouter(
    prefix="/user",
    tags=["User"]
)

@router.post("/contacts2")
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

    newresults = [ dict(cont) for cont in results]
    for contact in newresults:
        contact["messages"] = []


    return {"status": "success", "contacts":newresults}



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

    #print(connectioncheck)
    if not str(contactuserexist["id"]) in contacts:
        if contacts[0] == "":
            contacts[0] = str(contactuserexist["id"]) 
        else:
            contacts.append(str(contactuserexist["id"]))
        newcontacts = ','.join(contacts)

        

        #print("hello",  {"senderid": userexist["db_id"], "newcontacts": newcontacts})
        db_session.execute(
                    text("""
                         UPDATE users SET contacts=:newcontacts
                         WHERE id=:senderid
                         """),
                    {"senderid": userexist["db_id"], "newcontacts": newcontacts}
                )
        db_session.commit()

    return {"status": "success", "message":connectioncheck["connection"]}


@router.post("/settings")
def getUserSettings(token: Annotated[str, Form()]):
    userexist = confirmUserExists(token)

    print(userexist)
    db_session = get_session()
    result = db_session.execute(
                    text(f"""
                         SELECT U.username, IFNULL(UP.aboutme, '') AS aboutme
                         FROM users U
                         LEFT JOIN userprofile UP ON UP.user_id = U.id
                         WHERE U.delete_at IS NULL AND
                            U.username=:username AND U.unique_id=:uniqueid
                         """),
                         {"username": userexist["name"], "uniqueid": userexist["id"]}
                )
    
    print(userexist["name"], userexist["id"])
    results = result.mappings().fetchone()
    print(results)
    return {"status": "success", "profile":results}

@router.put("/settings")
def getUserSettings(token: Annotated[str, Form()], settings: Annotated[str, Form()]):
    userexist = confirmUserExists(token)

    import json
    data = json.loads(settings)

    print(settings)
    db_session = get_session()
    saveUserProfile(db_session, data, userexist["db_id"])
    return {"status": "success"}


@router.post("/messages")
def getPrivateMessage(token: Annotated[str, Form()], selecteduserid: Annotated[str, Form()]):
    userexist = confirmUserExists(token)

    db_session = get_session()
    receiverID = get_User_ID(db_session, selecteduserid)
    result = db_session.execute(
                    text(f"""
                         SELECT 
                            M.message
                            ,M.create_at
                            ,(SELECT U.username FROM users U WHERE U.id = M.sender_id) sender_username
                            ,(SELECT U.username FROM users U WHERE U.id = M.receiver_id) receiver_username
                            ,CASE
                                WHEN M.sender_id=:user_id then '1'
                                ELSE'2'
                            END 'type'
                         FROM messages M
                         WHERE M.delete_at IS NULL AND
                            (
                                (M.sender_id=:user_id AND M.receiver_id=:selected_userid) 
                                OR
                                (M.sender_id=:selected_userid AND M.receiver_id=:user_id)
                            )   
                         ORDER BY M.create_at
                         """),
                         {"user_id": userexist["db_id"], "selected_userid": receiverID}
                )
    
    
    results = result.mappings().all()
    results
    return {"status": "success", "messages":results}