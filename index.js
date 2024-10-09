import express from 'express';
import compiler from 'compilex';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: '*',
}));
app.use(express.json()); // Middleware to parse JSON bodies

// Initialize compiler
function tempInit() {
    const options = { stats: true };
    compiler.init(options);
}

// Routes
app.get("/", (req, res) => {
    res.status(200).send("<h1>Oneline IDE</h1>");
});

app.post("/runCppCode", (req, res) => {
    tempInit();
    const { language, code, input, isInput } = req.body;
    
    if (language === "Cpp") {
        if (!code) {    
            return res.status(400).send({ error: 'No code provided' });
        }

        const envData = {
            OS: "windows",
            cmd: "g++",
            options: { timeout: 5000 }
        };

        // Function to handle the result
        const handleResult = (data) => {
            res.send(data);
        };

        // Function to handle errors
        const handleError = (error) => {
            console.error("Compilation error:", error);
            res.status(500).send({ error: "An error occurred during compilation." });
        };

        try {
             
            compiler.compileCPP(envData, code, handleResult);
            
        } catch (error) {
            handleError(error);
        }
    } else {
        res.status(400).send({ error: 'Unsupported language' });
    }
});

// Start server
app.listen(8080, () => {
    console.log("Server started at http://localhost:8080");
});
