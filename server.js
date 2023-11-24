import app from './index.js';

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`index app listening on port ${port}!`));