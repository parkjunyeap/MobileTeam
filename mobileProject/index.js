const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/user/:id", (req, res) => {
  // Send an anchor tag as the response
  const p = req.params;
  console.log(p.id);
  res.send({ userId: p.id });
});

app.get("/cat/:id", (req, res) => {
  //?q=park 이런느낌
  const q = req.query;
  console.log(q.q);
  console.log(q.name);
  console.log(q);
  res.send("Hello cat!");
});

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// 포트의개념 항구 들어올수 있는 입구

// listen 하고잇어야햄
