import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";

import dotenv from "dotenv";
dotenv.config();

export const aj = arcjet({
    key: process.env.ARCJET_KEY,
    characteristics: ["ip.src"],
    rules: [
        // shield protects your app from common attacks e.g. SQL injection, XSS, CSRF attacks
        shield({ mode: "LIVE" }),
        detectBot({
            mode: "LIVE",
            // block all bots except search engines
            allow: [
                "CATEGORY:SEARCH_ENGINE"
            ]
        }),

        // rate limiting
        tokenBucket({
            mode: "LIVE",
            refillRate: 5,
            interval: 10,
            capacity: 10,
        })
    ]
});