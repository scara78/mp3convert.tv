// const { rateLimiter } = require("../../../utilities/rateLimiter2");
// const { transporter } = require("../../../utilities/transporter");
// const axios = require("axios");

// export default function handler(req, res) {
//   if (!req.body.email || !req.body.message) {
//     return res.json({ error: "Fill all the parameters" }).status(400);
//   }

//   rateLimiter
//     .consume(req.headers["x-forwarded-for"], 1)
//     .then(() => {
//       axios
//         .post(
//           "https://discord.com/api/webhooks/985828494120456242/usPEbNx5UPMUSAmjcXTsgVzRjPcWVJJlsnPjNaULd5X-vdwWil-zS5fR-nF6WmAP_MUG",
//           {
//             content: `**New Message Recieved**\n__Email__: ${req.body.email}\n\`\`\`${req.body.message}\`\`\``,
//           }
//         )
//         .then(async () => {
//           try {
//             const info = await transporter.sendMail({
//               from: '"Support | mp3convert.tv" <support@mp3convert.tv>', // sender address
//               to: req.body.email, // list of receivers
//               subject: "Contact Form Submission", // Subject line
//               text: `Hello, we recieved your message. Our Suport Team will look into it shortly.`, // plain text body
//             });

//             res.json({ success: true });
//           } catch (error) {
//             console.log(error);
//             return res.json({ error: "An error occured, try again later" });
//           }
//         })
//         .catch((error) => {
//           console.log(error);
//           return res.json({ error: "An error occured, try again later" });
//         });
//     })
//     .catch(() => {
//       res.status(429).json({ error: "You're being rate limited" });
//     });
// }
