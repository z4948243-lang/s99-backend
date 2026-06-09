const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// S99 Registration Endpoint
app.post('/api/s99-auth/signup', async (req, res) => {
    try {
        const { mobile, password } = req.body;
        
        // S98 Payload with YOUR Invite ID
        const s98Payload = {
            phone: mobile,
            password: password,
            invite_id: "753292685", // Aapka structural code
            source: "api_mobile"
        };

        // Sending data to S98 Platform
        const s98Response = await axios.post('https://www.s98bb.com/api/user/register', s98Payload, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': req.headers['user-agent'],
                'X-Forwarded-For': req.ip 
            }
        });

        if (s98Response.data.status === "success") {
            return res.status(200).json({
                success: true,
                message: "Account created on S99!",
                token: s98Response.data.session_token 
            });
        } else {
            return res.status(400).json({ success: false, message: s98Response.data.error_msg });
        }

    } catch (error) {
        console.error("Masking failed:", error.message);
        return res.status(500).json({ success: false, message: "Server busy, try again later." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`S99 Backend running on port ${PORT}`));
