export type RobotLoaderVariant = "eyes" | "assembly" | "orbital" | "diagnostic";

// All four designs are implemented. Change only `variant` to switch the hero loader.
export const GUIDE_LOADING: {
  variant: RobotLoaderVariant;
  timeoutMs: number;
} = {
  variant: "eyes",
  timeoutMs: 20_000,
};
