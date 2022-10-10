import express from "express";
import compression from "compression";
import { fileURLToPath } from "url";
import { dirname, sep } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url)) + sep;
const config = { 
	port: process.env.PORT || process.argv[2] || 3000,
	user: process.argv[2] || process.env.USER || process.env.USERNAME,
	dir: { root: __dirname, public: __dirname + "public" + sep, },
};
const app = express();
app.use(compression());
app.use((request, response, next)=>{
	const msg = "Request Logged:";
	console.log(msg, request.url);
	next();
});
app.get("/index", (request, response)=>{
	const label = "Requests";
	console.group(label);
	const requestInfo = { URL: request.url, Method: request.method, Host: request.rawHeaders[1] };
	console.table(requestInfo);
	console.groupEnd(label);
	const renderMsg = { title:`${config.user} says, "Hello"`};
	response.render("message", renderMsg );
});
app.use(express.static(config.dir.public));
app.use((request, response)=>{
	response.status(404).redirect("/404.html");
});

app.listen(config.port, ()=>{
	const msg = `Application Live @ http://localhost:${config.port}`;
	console.log(msg);
});
export{ config, app };
