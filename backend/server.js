import app from "./app.js";

const POTR = process.env.PROCESS || 5000;

app.listen(PORT, () => {
   console.log(`App is running on http:local${PORT}`);
});
