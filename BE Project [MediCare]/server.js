const http = require("http");
const fs = require("fs");
const qs = require("querystring");

const server = http.createServer((req, res) => {
    let { method } = req;

    if (method === "GET") {
        if (req.url === "/form") {
            fs.readFile("form.html", "utf8", (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end(data);
                }
            });

        } else if (req.url === "/records") {
            fs.readFile("records.html", "utf8", (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end(data);
                }
            });

        } else if (req.url === "/alldata") {
            fs.readFile("patients.json", "utf8", (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(data);
                }
            });

        } else {
            res.writeHead(404);
            res.end("Not Found");
        }

    } else if (method === "POST" && req.url === "/form") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", () => {
            fs.readFile("patients.json", "utf8", (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    let patients = JSON.parse(data || "[]");
                    const newPatient = qs.decode(body);
                    patients.push(newPatient);

                    fs.writeFile("patients.json", JSON.stringify(patients), (err) => {
                        if (err) {
                            res.writeHead(500);
                            res.end("Server Error");
                        } else {
                            res.writeHead(200, { "Content-Type": "text/html" });
                            res.end("<h1>Registration Successful!</h1>");
                        }
                    });
                }
            });
        });
    } else {
        res.writeHead(404);
        res.end("Not Found");
    }
});

server.listen(3000, () => {
    console.log("Server listening on port 3000");
});