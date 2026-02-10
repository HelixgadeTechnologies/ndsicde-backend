"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const secrets_1 = require("./secrets");
const swagger_1 = __importDefault(require("./swagger"));
const auth_middleware_1 = __importDefault(require("./middlewares/auth.middleware"));
const lfeCheck_1 = require("./routes/lfeCheck");
const routes_1 = __importDefault(require("./routes"));
var cors = require('cors');
let app = (0, express_1.default)();
app.use(cors());
app.set("trust proxy", 1);
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ limit: "10mb", extended: true }));
(0, swagger_1.default)(app);
app.use((req, res, next) => {
    const excludedRoutes = [
        "/api/auth/signIn",
        "/api/auth/signUp",
        "/api/auth/forgot-password"
    ];
    if (excludedRoutes.includes(req.path)) {
        return next();
    }
    (0, auth_middleware_1.default)(req, res, next);
});
app.use("/api", routes_1.default);
app.use("/", lfeCheck_1.lifeCheck);
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});
app.listen(secrets_1.PORT, () => console.log("The server is live"));
