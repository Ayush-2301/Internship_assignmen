import { PORT } from "@config/index";
import app from "@/index";

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
