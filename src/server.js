import { app } from "./app.js";

const APP_PORT = process.env.APP_PORT || 4001;

app.listen(APP_PORT, () => {
  console.log(`Server is running on port ${process.env.APP_PORT}`);
});
