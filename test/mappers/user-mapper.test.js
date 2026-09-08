/* global describe, expect, it */
/* eslint-disable @typescript-eslint/no-require-imports */

const { mapUser } = require("../../src/mappers/user-mapper");

describe("mapUser", () => {
  it("converts a Random User API response into the app user model", () => {
    const apiUser = {
      gender: "female",
      name: {
        title: "Madame",
        first: "Rose",
        last: "Fleury",
      },
      location: {
        street: {
          number: 544,
          name: "Gerrit Stapelstraat",
        },
        city: "Wapserveen",
        state: "Noord-Holland",
        country: "Netherlands",
        postcode: "5022 ZI",
        coordinates: {
          latitude: "59.1471",
          longitude: "-91.4028",
        },
        timezone: {
          offset: "+8:00",
          description: "Beijing, Perth, Singapore, Hong Kong",
        },
      },
      email: "rose.fleury@example.com",
      login: {
        uuid: "d4161e67-39ff-4d36-b91b-fc04d9798943",
        username: "sadwolf814",
        password: "aikman",
        salt: "K07ZnxSL",
        md5: "b7d787f7c22235f5db7f7888eabf8bbb",
        sha1: "7a34810fe759838a9a2b222c087161d305e40fa7",
        sha256: "8ba2b9ff78b75af53c01575534f5fbbdd3a5866e97055d7f70894db5af3a6ade",
      },
      dob: {
        date: "1945-05-10T17:27:33.729Z",
        age: 81,
      },
      registered: {
        date: "2007-08-22T06:12:20.147Z",
        age: 19,
      },
      phone: "077 552 24 53",
      cell: "079 587 71 37",
      id: {
        name: "AVS",
        value: "756.1376.4904.66",
      },
      picture: {
        large: "https://randomuser.me/api/portraits/women/80.jpg",
        medium: "https://randomuser.me/api/portraits/med/women/80.jpg",
        thumbnail: "https://randomuser.me/api/portraits/thumb/women/80.jpg",
      },
      nat: "CH",
    };

    expect(mapUser(apiUser)).toEqual({
      id: "d4161e67-39ff-4d36-b91b-fc04d9798943",
      firstname: "Rose",
      lastname: "Fleury",
      fullname: "Rose Fleury",
      avatar: "https://randomuser.me/api/portraits/women/80.jpg",
      email: "rose.fleury@example.com",
      phone: "077 552 24 53",
      location: {
        city: "Wapserveen",
        state: "Noord-Holland",
        country: "Netherlands",
      },
    });
  });
});
