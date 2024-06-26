import app from "./src/app";

const port = process.env.PORT || 3001;

// activate the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log(`Node environment: ${process.env.NODE_ENV ?? "development"}`)
});