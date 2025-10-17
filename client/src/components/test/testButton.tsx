import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import { visionAsk } from "../../pixels/remote-engine-pixels";
import { imageGeneration } from "../../pixels/remote-engine-pixels";
import { getAudioModels } from "../../pixels/pixel-calls";
import modelsStore from "../../stores/modelsStore";

const TestButton = observer(() => {
  const logData = async () => {
    const response = await getAudioModels();
    console.log(response);
  };
  return <button onClick={logData}>Fetch Models</button>;
});

export default TestButton;
