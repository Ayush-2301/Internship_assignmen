import { cleanEnv, port, url, str } from "envalid";
const validateEnv = () => {
  cleanEnv(process.env, {
    PORT: port(),
    DATABASE_URL: url(),
    DB_NAME: str(),
  });
};

export default validateEnv;
