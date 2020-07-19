import { Router } from "express";

import { MailSender } from "../mailSender";
import { pool } from "../db";

const router = Router();

const prepareEmail = (messagesResponse, email) => {
    const sendMail = new MailSender();
    const { message, subject } = messagesResponse.rows[0];
    const payload = {
        subject,
        text: message,
        to: email
    }

    sendMail.sendingMail(payload);
}

// create account
router.post("/create-account", async (req, res) => {
    try {
        const { email, password } = req.body;
        const createAccountResponse = await pool.query(
            "INSERT INTO users (email, password) VALUES($1, $2)",
            [email, password]
        )
        const getMessagesResponse = await pool.query(
            "SELECT * FROM messages WHERE id IN ($1)",
            [1]
        )

        prepareEmail(getMessagesResponse, email);

        res.json(createAccountResponse.rows);
    } catch (error) {
        console.log("error - create account ", error);
    }
});

export default router;
