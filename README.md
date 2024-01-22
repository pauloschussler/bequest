# Tamper Proof Data

At Bequest, we require that important user data is tamper proof. Otherwise, our system can incorrectly distribute assets if our internal server or database is breached. 

**1. How does the client ensure that their data has not been tampered with?**
<br />
**2. If the data has been tampered with, how can the client recover the lost data?**

## Assignment solution:

### 1. How Does the Client Ensure That Their Data Has Not Been Tampered With?

#### Digital Signatures:
I implemented a digital signature system using Node.js's crypto module. Each time data is updated, it is signed with a private key on the server. This creates a unique signature based on the data's content.

#### Verification on the Client-Side:
When the client receives data from the server, it can verify the integrity of the data using the corresponding public key. If the data has been tampered with after signing, the verification will fail, alerting the client that the data integrity has been compromised.

### 2. If the Data Has Been Tampered With, How Can the Client Recover the Lost Data?

#### History Storage:
With each valid update (performed via the POST "/" route), the current state of the database is stored in a history array. This creates a record of all previous versions of the data.

#### Recovery Function:
A recover function was implemented to revert the data to the last valid state stored in history. This is triggered through a GET "/recover" route on the server. When called, this function retrieves the last known good state of the data, allowing the client to restore the data to a state prior to tampering.

### Overall Application Description

#### Express Server:
An Express server was set up to manage requests, including routes for fetching, updating, tampering, and recovering data.

#### RSA Key Generation:
We used generateKeyPairSync to create a pair of RSA keys that are used for signing and verifying data.

#### API Routes:

GET "/": Returns the current data along with signature verification.
POST "/": Updates the data and signature, storing the previous state in history.
POST "/tamper": Tampers with the data without re-signing, to simulate a data breach.
GET "/recover": Reverts the data to the last valid state.


#### React Front-End Application:

Features were implemented to interact with the server, such as updating data, verifying integrity, tampering data for tests, and recovering data after tampering.
Use of useState and useEffect to manage the data state and make requests to the API.
Implementation of conditional logic to enable actions (like "Temper Data") only under certain conditions (e.g., when data in the form has been changed).

#### The time spent was 6 hours.
