export default () => {
  // start up the databases
  import("../database/index").then((db) => {
    // connect to database
    db.default();
    // seed database
    import("./seeder").then((seeder) => {
      seeder.default();
    });
  });
};
