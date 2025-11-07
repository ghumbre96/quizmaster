import { app } from "./app.js";
import { PORT } from "./config/env.js";

app.listen(PORT, () => console.log(` API running on http://localhost:${PORT}`));
