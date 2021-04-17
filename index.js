const mongoose = require("mongoose");
const mongoURL = "mongodb+srv://admin:admin@cluster0.bu6gc.mongodb.net/ItemsDB?retryWrites=true&w=majority"
const connectionOptions = { useNewUrlParser: true, useUnifiedTopology: true }

const Schema = mongoose.Schema
const ItemSchema = new Schema({
    name: String,
    rarity: String,
    description: String,
    goldPerTurn: Number
}, { collection: 'items_table' })
const Item = mongoose.model("items_table", ItemSchema)

const express = require("express");
const app = express();
app.use(express.json())
const HTTP_PORT = process.env.PORT || 8080;

// Get items
app.get("/api/items", (req, res) => {
    Item.find().exec().then(
        (result) => {
            res.send(result)
        }
    ).catch(
        (err) => {
            res.status(500).send("An internal error occurred on the server side.")
        }
    )
})

// Get items by name
app.get("/api/items/:item_name", (req, res) => {
    Item.find({ name: req.params.item_name }).exec().then(
        (result) => {
            if (result.length === 0) {
                res.status(404).send("The requested resource could not be found.")
            } else {
                res.send(result)
            }
        }
    ).catch(
        (err) => {
            res.status(500).send("An internal error occurred on the server side.")
        }
    )
})

// Insert item
app.post("/api/items", (req, res) => {
    Item.create(req.body).then(
        (result) => {
            res.status(201).send("The request was fulfilled and a new resource was created.")
        }
    ).catch(
        (err) => {
            res.status(500).send("An internal error occurred on the server side.")
        }
    )
})

// Delete item
app.put("/api/items/:sid", (req, res) => {
    res.status(501).send("The requested endpoint is currently not available, but may be implemented in the future.")
})

// Update item
app.delete("/api/items/:item_name", (req, res) => {
    Item.findOneAndDelete({ name: req.params.item_name }).exec().then(
        (result) => {
            if (result === null) {
                res.status(404).send("The requested resource could not be found.")
            } else {
                res.status(200).send("The request was successfully processed by the server.")
            }
        }
    ).catch(
        (err) => {
            res.status(500).send("An internal error occurred on the server side.")
        }
    )
})

const onHttpStart = () => {
    console.log(`Server has started and is listening on port ${HTTP_PORT}`)
}

mongoose.connect(mongoURL, connectionOptions).then(
    () => {
        console.log("Connection success")
        app.listen(HTTP_PORT, onHttpStart);
    }
).catch(
    (err) => {
        console.log("Error connecting to database")
    }
)