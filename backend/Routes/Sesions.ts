import express from "express";
import jwt from "jsonwebtoken";
import { encrypt } from "../Helpers/Pbkdf2";
import pg from "../Database/pg";

export const sessions = express.Router();

sessions.post("/verify", async (req, res) => {
  if (!req.body.token) return res.status(400).json({ success: false, error: "Missing 'token' on request" });
  
  let tokenBody;
  try {
    tokenBody = jwt.verify(req.body.token, process.env.JWT_SECRET || "") as {  udid?: string, model?: string  }; 
  } catch {
    return res.status(400).json({ success: false, error: "Invalid token" });    
  }

  let hash;
  try {
    hash = await encrypt(tokenBody.udid || "", tokenBody.model || "");
  } catch {
    return res.status(400).json({ success: false, error: "Internal server error" });   
  }

  let device;
  let session;
  try {
    device = await pg("devices").select().where({ hash: hash }).first();
    if (!device) return res.status(400).json({ success: false, error: "Device not found" }); 

    console.log(device)

    session = await pg("sessions").select().where({ device_id: parseInt(device.device_id || "") }).innerJoin("accounts", "sessions.user_id", "accounts.id").first();
  } catch(e) {
    console.log(e)
    return res.status(400).json({ success: false, error: "Internal server error" }); 
  }

  if (!session) return res.status(400).json({ success: false });
  
  return res.status(200).json({ success: true, session });
});