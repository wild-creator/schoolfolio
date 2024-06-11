const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const admin = require("firebase-admin");

const app = express();
const port = process.env.PORT || 5000;

// Replace with your actual service account key path
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://school-project-31175.appspot.com",
});
const bucket = admin.storage().bucket();

const uri =
  "mongodb+srv://faveejiofor2009:ybffqUz8267uEFY6@portfolio.0ixnpy5.mongodb.net/?retryWrites=true&w=majority&appName=Portfolio";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: fileFilter,
});

let database, collection;

async function initializeDatabase() {
  try {
    await client.connect();
    database = client.db("portfolio");
    collection = database.collection("user");
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
    process.exit(1); // Exit the process with an error code
  }
}

async function getCollectionData() {
  try {
    const data = await collection.find({}).toArray();
    return data;
  } catch (error) {
    console.error("Error getting collection data:", error);
    throw error;
  }
}

async function addContact(contact) {
  try {
    const result = await collection.insertOne(contact);
    return { ...contact, _id: result.insertedId };
  } catch (error) {
    console.error("Error adding contact:", error);
    throw error;
  }
}

async function updateContact(id, updatedContact) {
  try {
    const { _id, ...updateData } = updatedContact;
    console.log("Updating contact with ID:", id);
    console.log("Updated contact data:", updateData);
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    console.log("Update result:", result);
    return result.modifiedCount > 0 ? { _id: id, ...updateData } : null;
  } catch (error) {
    console.error("Error updating contact:", error);
    throw error;
  }
}

async function deleteContact(id) {
  try {
    const contact = await collection.findOne({ _id: new ObjectId(id) });
    if (contact && contact.picture) {
      const fileName = contact.picture.split("/").pop();
      const file = bucket.file(fileName);
      await file.delete();
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error deleting contact:", error);
    throw error;
  }
}

app.get("/api/user", async (req, res) => {
  try {
    const data = await getCollectionData();
    res.json(data);
  } catch (error) {
    console.error("GET /api/user error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/user", upload.single("picture"), async (req, res) => {
  try {
    let pictureUrl = "";
    if (req.file) {
      const blob = bucket.file(
        Date.now() + path.extname(req.file.originalname)
      );
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      blobStream.on("error", (error) => {
        console.error("Error uploading file:", error);
        res.status(500).json({ error: error.message });
      });

      blobStream.on("finish", async () => {
        await blob.makePublic();
        pictureUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        const newContact = {
          ...req.body,
          picture: pictureUrl,
        };
        const addedContact = await addContact(newContact);
        res.status(201).json(addedContact);
      });

      blobStream.end(req.file.buffer);
    } else {
      const newContact = {
        ...req.body,
        picture: pictureUrl,
      };
      const addedContact = await addContact(newContact);
      res.status(201).json(addedContact);
    }
  } catch (error) {
    console.error("POST /api/user error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/user/:id", upload.single("picture"), async (req, res) => {
  try {
    const id = req.params.id;
    let pictureUrl = req.body.picture;

    if (req.file) {
      const blob = bucket.file(
        Date.now() + path.extname(req.file.originalname)
      );
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      blobStream.on("error", (error) => {
        console.error("Error uploading file:", error);
        res.status(500).json({ error: error.message });
      });

      blobStream.on("finish", async () => {
        await blob.makePublic();
        pictureUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        const updatedContact = {
          ...req.body,
          picture: pictureUrl,
        };
        const result = await updateContact(id, updatedContact);
        if (result) {
          res.json(result);
        } else {
          res.status(404).json({ error: "Contact not found" });
        }
      });

      blobStream.end(req.file.buffer);
    } else {
      const updatedContact = {
        ...req.body,
        picture: pictureUrl,
      };
      const result = await updateContact(id, updatedContact);
      if (result) {
        res.json(result);
      } else {
        res.status(404).json({ error: "Contact not found" });
      }
    }
  } catch (error) {
    console.error("PUT /api/user/:id error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Deleting contact with id:", id);
    const result = await deleteContact(id);
    if (result) {
      res.status(204).send(); // No content
    } else {
      res.status(404).json({ error: "Contact not found" });
    }
  } catch (error) {
    console.error("DELETE /api/user/:id error:", error);
    res.status(500).json({ error: error.message });
  }
});

initializeDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server running at ${port}`);
  });
});
