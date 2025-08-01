import app from './app';

(async () => {
  try {
    app.listen(process.env.PORT, () => {
      console.log(`Express App Listening on Port ${process.env.PORT}`)
    });
  } catch (error) {
    console.error(`An error occurred: ${JSON.stringify(error)}`);
    process.exit(1);
  }
})();