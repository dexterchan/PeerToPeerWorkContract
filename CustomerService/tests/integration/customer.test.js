const request = require("supertest");

describe("/api/customer", () => {
  let server;

  const exec = async () => {
    return await request(server)
      .get("/api/customer")
      //.set("x-auth-token",token)
      .send();
  };
  const exec_id = async id => {
    return await request(server)
      .get(`/api/customer/${id}`)
      //.set("x-auth-token",token)
      .send();
  };
  //called before each of test case running
  beforeEach(async () => {
    server = require("../../index");
  });

  afterEach(async () => {});
  it("should work!", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
    expect(res.text).toBe("customer OK");
  });
  it("should work with id!", async () => {
    const name = "ironman";
    const res = await exec_id(name);
    console.log(res.body);
    const retObj = res.body;
    expect(res.status).toBe(200);
    //expect(res.).toBe("customer OK");
    expect(retObj).toHaveProperty("id");
    expect(retObj["id"]).toBe(name);
  });
});
