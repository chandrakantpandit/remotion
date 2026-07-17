import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { MoleculeStates } from "./MoleculeStates";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="MoleculeStates"
        component={MoleculeStates}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
