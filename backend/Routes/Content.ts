import express from "express";

export const content = express.Router();

content.get("/package/:id", async (req, res) => {
  //here we will check all the package perms
});