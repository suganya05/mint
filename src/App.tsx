import { useEagerConnect } from "./hooks/useEagerConnect";
import Mint from "./Mint";

const App = () => {
  useEagerConnect();
  return (
    <>
      <Mint />
    </>
  );
};

export default App;
