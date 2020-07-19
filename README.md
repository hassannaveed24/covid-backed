# Mediasoup-server


###########################
###########################
###########################
GET API /getPotentialCase
this will return array of object where each object represents a 
patient(
    imageURL: String,
    floor: String,
    location:{
        top: String,
        right: String
    },
    timestamp:{
        type: Date,
        default: new Date
    },
    locationName: String,
    readings:{
        thermometer: String,
        oxymeter: String
    }
)

###########################
###########################
###########################

POST API /savePotentialCase
this will save potential 
patient(
imageURL: String,
    floor: String,
    location:{
        top: String,
        right: String
    },
    timestamp:{
        type: Date,
        default: new Date
    },
    locationName: String,
    readings:{
        thermometer: String,
        oxymeter: String
    }
) in database and then emit potentialPateint details as socket event 'broadcastPotentialPatient'

###########################
###########################
###########################

emit potentialPateint details as socket event 'broadcastPotentialPatient'
    
   
###########################
###########################
##########################


POST API /addThreshold
add new 
threshold(
    temperatreThreshold: {
        from: {
            type: Number,
            default: 37
        },
        to: {
            type: Number,
            default: 38
        }
    },
    oxymeterThreshold: {
        from: {
            type: Number,
            default: 75
        },
        to: {
            type: Number,
            default: 100
        }
    }
)


###########################
###########################
##########################

GET API /viewThreshold
send threshold stored in db  in the form of threshold Schema

 temperatreThreshold: {
        from: {
            type: Number,
            default: 37
        },
        to: {
            type: Number,
            default: 38
        }
    },
    oxymeterThreshold: {
        from: {
            type: Number,
            default: 75
        },
        to: {
            type: Number,
            default: 100
        }
    }
    
###########################
###########################
##########################

GET API send message   /sendmessage/:type/:entranceName/:id
send message to respective roles i.e. SecirityTeam or CLeaningTeam which was passed through params 
if success then throw response 

Message has been Sent.




installing node in ubuntu

curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -

sudo apt-get install -y nodejs




After running these commands, node will install; to make sure node is installed properly run

node --version

this would throw v >14




to install curl, you have to run following command

sudo apt-get install curl


Change config.js file according to yourself i.e. 

Change listen IP to your machine's IPv address




sudo npm install

sudo npm start



Here you go.
