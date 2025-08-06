import { Request, Response } from "express";
export const lifeCheck = async (req: Request, res: Response) => {
    res.send("<h1>NDSICDE SERVER RUNNING IN GOOD HEALTH WITH THE DATABASE</h1>");
};