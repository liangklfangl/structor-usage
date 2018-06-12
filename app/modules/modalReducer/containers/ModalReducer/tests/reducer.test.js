import expect from "expect";
import modalReducerReducer from "../reducer";

describe("modalReducerReducer", () => {
  it("returns the initial state", () => {
    expect(modalReducerReducer(undefined, {})).toEqual({ name: "Sample Name" });
  });
});
