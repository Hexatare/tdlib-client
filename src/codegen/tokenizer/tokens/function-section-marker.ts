import { createToken } from "chevrotain";

export const FunctionSectionMarkerToken = createToken({
    name: "FunctionSectionMarker",
    pattern: "---functions---",
});
