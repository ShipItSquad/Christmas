import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APITester } from "./APITester";
import { ChristmasScene } from "./components/ChristmasScene";
import "./index.css";
export function App() {
  return (
    <>
      <ChristmasScene />
      <div className="pointer-events-none fixed z-0 w-screen h-screen  flex justify-center items-center">
        hi
      </div>
    </>
  );
}

export default App;
