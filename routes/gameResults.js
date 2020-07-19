import { Router } from "express";
import { pool } from "../db";

const router = Router();
const date = new Date();

// get game result
router.get("/get-results", async (req, res) => {
    console.log("process ", process.env);
    try {
        const getAllGameResultsResponse = await pool.query(
            "SELECT * FROM games",
        );

        res.json(getAllGameResultsResponse.rows);
    } catch (error) {
        console.log("error - get-game-result ", error);
    }
});

// get single game result
router.get("/get-result/:id", async (req, res) => {
   try {
       const { id } = req.params;
       const getSelectedResult = await pool.query(
           "SELECT * FROM games WHERE id IN ($1)",
           [id]
       )

       res.json(getSelectedResult.rows);
   } catch (error) {
       console.log("error - get single game result ", error);
   }
});

// add game result
router.post("/add-result", async (req, res) => {
    try {
        const { winner, loser, result } = req.body;
        const addGameResultResponse = await pool.query(
            "INSERT INTO games (winner, loser, result, date) VALUES($1, $2, $3, $4)",
            [winner, loser, result, date]
        );

        res.json(addGameResultResponse.rows);
    } catch (error) {
        console.log("error - add-game-result ", error);
    }
});

// delete single game result
router.delete("/remove-result/:id", async (req, res) => {
   try {
       const { id } = req.params;
       const removeGameResultResponse = await pool.query(
           "DELETE FROM games WHERE id IN ($1)",
           [id]
       )

       res.json(removeGameResultResponse.rows);
   } catch (error) {
       console.log("error - delete single game result ", error);
   }
});

// update result by id
router.patch("/update-result/:id", async (req, res) => {
   try {
       const { id } = req.params;
       const { winner, loser, result } = req.body;
       const updateGameResultResponse = await pool.query(
           "UPDATE games SET winner = $1, loser = $2, result = $3 WHERE id = $4 RETURNING *",
           [winner, loser, result, id]
       );

       res.json(updateGameResultResponse.rows);
   } catch (error) {
       console.log("error - update result ", error);
   }
});

export default router;
