// Lets image assets be imported (see constants/images.ts). Metro turns each
// import into an asset reference that <Image source> accepts.
declare module "*.png" {
  import type { ImageSourcePropType } from "react-native";
  const source: ImageSourcePropType;
  export default source;
}
