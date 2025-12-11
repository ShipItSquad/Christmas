import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APITester } from "./APITester";
import { ChristmasScene } from "./components/ChristmasScene";
import "./index.css";
export function App() {
  return (
    <>
      <ChristmasScene />
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center z-50 bg-blue-600/20 text-white">
 <div className="font-sans font-bold flex flex-col items-center justify-center  p-4 rounded-lg">
  <h1 className="text-4xl"> AdventureClub</h1>
  <h1 className="text-2xl font-normal">Merry Christmas</h1>

 </div>
</div> 
    </>
  );
}

export default App;
