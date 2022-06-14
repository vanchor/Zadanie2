const express = require("express");

const redis = require("redis");
const app = express();

const port = 3001;

const redisClient = redis.createClient({
  socket: {
    port: 6379,
    host: "redis",
  },
});

app.get("/api/gs_calc", async (req, res) => {
  if (req.query.a == null || 
      req.query.q == null ||
      req.query.n == null) {
    res.sendStatus(400);
    return;
  }

  const { a, q, n } = req.query;
  await redisClient.connect();
  let value = await redisClient.get(a + "");

  if (value == null) {
    value = a * Math.pow(q, n - 1);
    redisClient.set(a + "", value + "");
  }
  
  redisClient.quit();
  res.status(200).send({ result: value });
});

app.listen(port, () => {
  console.log(`GS Calc listening on ${port}`);
});
