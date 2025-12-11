import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APITester } from "./APITester";
import { ChristmasScene } from "./components/ChristmasScene";
import "./index.css";
import { motion } from "motion/react";
export function App() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 , backgroundColor: "black"}} transition={{ duration: 2 , ease: "easeInOut" }}>
      <ChristmasScene />
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center z-50 bg-blue-600/20 text-white">
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 , y: 10  }} transition={{ duration: 1 , delay: 3 , ease: "easeInOut" }} className="font-sans font-bold flex flex-col items-center justify-center  p-4 rounded-lg">
  <h1 className="text-4xl"> AdventureClub</h1>
  <h1 className="text-xl font-normal">Merry Christmas</h1>

 </motion.div>
</div> 
    </motion.div>
  );
}

export default App;
