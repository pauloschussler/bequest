import express, { Express, Request, Response } from "express";
import cors from "cors";
import { createSign, createVerify, generateKeyPairSync } from "crypto";

const PORT: number = 8080;
const app: Express = express();

const { privateKey: PRIVATE_KEY, publicKey: PUBLIC_KEY } = generateKeys();

interface Database {
  data: string;
  signature: string;
}

const initialData: string = "Hello World";
const database: Database = {
  data: initialData,
  signature: signData(initialData)
};
const history: Database[] = [];

app.use(cors());
app.use(express.json());

function signData(data: string): string {
  const sign = createSign('SHA256');
  sign.update(data);
  return sign.sign(PRIVATE_KEY, 'hex');
}

function generateKeys() {
  const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });

  return { privateKey, publicKey };
}

function verifySignature(data: string, signature: string): boolean {
  const verify = createVerify('SHA256');
  verify.update(data);
  return verify.verify(PUBLIC_KEY, signature, 'hex');
}

function recover(): void {

  const lastValidState = history.pop();

  if (lastValidState) {
    database.data = lastValidState.data;
    database.signature = lastValidState.signature;
  }
}

// Routes
app.get("/", (req: Request, res: Response) => {
  if (verifySignature(database.data, database.signature)) {
    res.json(database);
  } else {
    res.status(500).send("Data integrity check failed");
  }
});

app.post("/", (req: Request, res: Response) => {
  history.push({ ...database });

  database.data = req.body.data;
  database.signature = signData(database.data);

  res.sendStatus(200);
});

app.post("/temper", (req: Request, res: Response) => {

  database.data = req.body.data;
  res.sendStatus(200);
});

app.get("/recover", (req: Request, res: Response) => {
  recover();
  res.json(database);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
