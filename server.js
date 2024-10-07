const express = require('express');
const path = require('path');
const { connect, jetstream, StringCodec } = require("nats");
const app = express();
const PORT = 3000;

let natsClient;

async function initNATS() {
    natsClient = await connect({ servers: "nats://localhost:4223" }); 
}

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to fetch color from NATS based on username
app.get('/color', async (req, res) => {
    const username = req.query.username; // Get username from query parameters
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    try {
        console.log("===========");
        const sc = StringCodec();
        const js = (await natsClient).jetstream();
        const bucketName = "my_bucket_3";
        const kv = await js.views.kv(bucketName);
        const key = `leaf-node-1.variations.${username}`; 
        const result = await kv.get(key);
        
        if (!result || !result.value) {
            return res.status(404).json({ error: 'No color data found for this user' });
        }

        const variationData = JSON.parse(sc.decode(result.value));
        console.log("variation data is: ", variationData);
        const color = JSON.parse(variationData['feature-1']);
        console.log("color is: ", color.color);
        res.json(color.color); // Send back the color
    } catch (error) {
        console.error("Error fetching color from NATS:", error);
        res.status(500).json({ error: 'Failed to fetch color' });
    }
});

// Initialize NATS and start the server
initNATS().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("Failed to connect to NATS:", err);
});
