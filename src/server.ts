import { number } from "joi";
import App from "./app";

import { connectDb } from "./dbConnection";

const dotenv = require("dotenv");
dotenv.config();

const serverPort: number | string = process.env.PORT || 4000;

connectDb()
  .then(async () => {
    App.start(serverPort);
    App.instance.listen(serverPort, function () {
      console.info(
        `App listening on environment "${process.env.NODE_ENV}" ${serverPort}`
      );
    });
  })
  .catch((error) => {
    console.error("error while connect to database", error);
  });
