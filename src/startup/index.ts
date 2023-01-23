export default () => {
  // start up the databases
  import("../database/index").then((db) => {
    db.default();
  });
};
