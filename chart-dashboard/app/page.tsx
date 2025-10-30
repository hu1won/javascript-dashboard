'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import LineChart from "@/components/LineChart"
import BarChart from "@/components/BarChart"
import PieChart from "@/components/PieChart"
import Button6 from "@/components/Button6"
import Button8 from "@/components/Button8"
import Button9 from "@/components/Button9"
import Button10 from "@/components/Button10"
import Button11 from "@/components/Button11"
import Button12 from "@/components/Button12"
import Button13 from "@/components/Button13"
import Button13_1 from "@/components/Button13_1"
import Button14 from "@/components/Button14"
import Button15 from "@/components/Button15"
import Button15_1 from "@/components/Button15_1"
import Button16 from "@/components/Button16"
import Button17 from "@/components/Button17"
import Button17_1 from "@/components/Button17_1"
import Button18 from "@/components/Button18"
import Button19 from "@/components/Button19"
import Button20 from "@/components/Button20"
import Button21 from "@/components/Button21"
import Button22 from "@/components/Button22"
import Button23 from "@/components/Button23"
import Button24 from "@/components/Button24"
import Button25 from "@/components/Button25"
import Button4 from "@/components/Button4"
import Button7 from "@/components/Button7"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  const [activeChart, setActiveChart] = useState<number | null>(null)

  const renderChart = () => {
    switch(activeChart) {
      case 1:
        return <LineChart />
      case 2:
        return <BarChart />
      case 3:
        return <PieChart />
      case 4:
        return <Button4 />
      case 7:
        return <Button7 />
      case 6:
        return <Button6 />
      case 8:
        return <Button8 />
      case 9:
        return <Button9 />
      case 10:
        return <Button10 />
      case 11:
        return <Button11 />
      case 12:
        return <Button12 />
      case 13:
        return <Button13 />
      case 13.1:
        return <Button13_1 />
      case 14:
        return <Button14 />
      case 15:
        return <Button15 />
      case 15.1:
        return <Button15_1 />
      case 16:
        return <Button16 />
      case 17:
        return <Button17 />
      case 17.1:
        return <Button17_1 />
      case 18:
        return <Button18 />
      case 19:
        return <Button19 />
      case 20:
        return <Button20 />
      case 21:
        return <Button21 />
      case 22:
        return <Button22 />
      case 23:
        return <Button23 />
      case 24:
        return <Button24 />
      case 25:
        return <Button25 />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-12">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-indigo-800 shadow-text">차트 대시보드</h1>
        <Card className="mb-8 p-6 bg-white bg-opacity-80 backdrop-blur-md">
          <div className="grid grid-cols-10 gap-2">
            {Array.from({ length: 25 }, (_, i) => (
              <Button 
                key={i} 
                onClick={() => setActiveChart(i + 1)}
                className={`text-sm py-2 px-3 rounded-full transition-all duration-200 ${
                  activeChart === i + 1 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'bg-white text-indigo-600 hover:bg-indigo-100'
                }`}
              >
                {i + 1}
              </Button>
            ))}
            <Button 
              onClick={() => setActiveChart(13.1)}
              className={`text-sm py-2 px-3 rounded-full transition-all duration-200 ${
                activeChart === 13.1 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'bg-white text-indigo-600 hover:bg-indigo-100'
              }`}
            >
              13-1
            </Button>
            <Button 
              onClick={() => setActiveChart(15.1)}
              className={`text-sm py-2 px-3 rounded-full transition-all duration-200 ${
                activeChart === 15.1 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'bg-white text-indigo-600 hover:bg-indigo-100'
              }`}
            >
              15-1
            </Button>
            <Button 
              onClick={() => setActiveChart(17.1)}
              className={`text-sm py-2 px-3 rounded-full transition-all duration-200 ${
                activeChart === 17.1 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'bg-white text-indigo-600 hover:bg-indigo-100'
              }`}
            >
              17-1
            </Button>
          </div>
        </Card>
        <Card className="bg-white bg-opacity-90 backdrop-blur-md shadow-xl rounded-xl overflow-hidden">
          <CardContent className="p-6">
            {renderChart()}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}