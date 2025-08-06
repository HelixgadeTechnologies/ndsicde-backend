import express, { Express, Request, Response } from "express";
import { PORT } from "./secrets";
import setupSwagger from "./swagger";
import authenticateToken from "./middlewares/auth.middleware";
import { lifeCheck } from "./routes/lfeCheck";
import rootRoutes from "./routes";

var cors = require('cors')
let app: Express = express();

// Enable CORS before body parsers (to handle preflight requests properly)
app.use(cors());

// Trust proxy (for Heroku or reverse proxies)
app.set("trust proxy", 1);

// Body parsing middleware (AFTER CORS)
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" })); // Increase JSON payload limit
app.use(express.urlencoded({ limit: "10mb", extended: true })); // Increase URL-encoded payload limit

// Setup Swagger (AFTER routes, so it doesn't interfere)
setupSwagger(app);

// Apply JWT middleware for all protected POST requests
app.use((req, res, next) => {
    // Define routes to exclude from authentication
    const excludedRoutes = [
        "/api/auth/signIn",
        "/api/auth/signUp",
        "/api/auth/forgot-password"
    ];

    if (excludedRoutes.includes(req.path)) {
        return next(); // Skip authentication for these routes
    }

    authenticateToken(req, res, next); // Apply middleware for all other routes
});


// Register routes
app.use("/api", rootRoutes);
app.use("/", lifeCheck);
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

app.listen(PORT, () => console.log("The server is live"));