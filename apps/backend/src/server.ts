import app from "./app.js";
import { env } from "@rvalte-hu/config";

const PORT = env.backendPort;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
