const express = require("express");
const app = express();
const client = require("prom-client");

let register = new client.Registry();

const oneCount = new client.Counter({
  name: "one_count",
  help: "Number of ones",
});

const twoCount = new client.Counter({
  name: "two_count",
  help: "Number of twos",
});

const threeCount = new client.Counter({
  name: "three_count",
  help: "Number of threes",
});

const fourCount = new client.Counter({
  name: "four_count",
  help: "Number of fours",
});

const fiveCount = new client.Counter({
  name: "five_count",
  help: "Number of fives",
});

const sixCount = new client.Counter({
  name: "six_count",
  help: "Number of sixes",
});

const rollCount = new client.Counter({
  name: "roll_count",
  help: "Number of rolls",
});

register.registerMetric(oneCount);
register.registerMetric(twoCount);
register.registerMetric(threeCount);
register.registerMetric(fourCount);
register.registerMetric(fiveCount);
register.registerMetric(sixCount);
register.registerMetric(rollCount);

register.setDefaultLabels({
  app: "dice-api",
});

client.collectDefaultMetrics({ register });

app.get("/roll-dice", (request, response) => {
  const times = request.query.times;
  if (times && times > 0) {
    rollCount.inc(Number(times));
    let counts = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < times; i++) {
      let randomNumber = Math.floor(Math.random() * 6) + 1;
      counts[randomNumber - 1]++;
    }

    oneCount.inc(counts[0]);
    twoCount.inc(counts[1]);
    threeCount.inc(counts[2]);
    fourCount.inc(counts[3]);
    fiveCount.inc(counts[4]);
    sixCount.inc(counts[5]);

    response.json({ counts });
  } else {
    response.send("Specify the number of times to roll the dice.");
  }
});

app.get("/metrics", async (request, response) => {
  response.setHeader("Content-type", register.contentType);
  response.end(await register.metrics());
});

app.listen(5000, () => {
  console.log("Started server. Listening on port 5000.");
});
