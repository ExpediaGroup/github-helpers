import {GITHUB_OPTIONS} from "../src/constants";

describe('constants', function () {
  it('should produce correct github options', function () {
    expect(GITHUB_OPTIONS).toEqual({
      headers: {
        accept: 'application/vnd.github.ant-man-preview+json,application/vnd.github.flash-preview+json,application/vnd.github.groot-preview+json,application/vnd.github.inertia-preview+json,application/vnd.github.starfox-preview+json'
      }
    })
  });
});
