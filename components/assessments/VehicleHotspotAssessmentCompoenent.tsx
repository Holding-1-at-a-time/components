import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { Id } from '../../convex/_generated/dataModel';

type Key = string | number | symbol;
type Value = string | number | object | null | undefined;

type KeyMap = Record<Key, Value>;
interface VehiclePart {
  [x: string]: Key | null | undefined;
  name: string;
  x: number;
  y: number;
};

interface Hotspot {
  part: string;
  issue: string;
}

interface VehicleHotspotAssessmentProps {
  onAssessment: (assessment: Hotspot[]) => void;
}

const vehicleParts: VehiclePart[] = [
  { name: "Front Bumper", x: 50, y: 10 },
  { name: "Hood", x: 50, y: 30 },
  { name: "Windshield", x: 50, y: 40 },
  { name: "Roof", x: 50, y: 50 },
  { name: "Trunk", x: 50, y: 80 },
  { name: "Rear Bumper", x: 50, y: 90 },
  { name: "Left Front Door", x: 30, y: 40 },
  { name: "Right Front Door", x: 70, y: 40 },
  { name: "Left Rear Door", x: 30, y: 60 },
  { name: "Right Rear Door", x: 70, y: 60 },
  // Add more parts as needed
];

export default function VehicleHotspotAssessment({ onAssessment }: Readonly<VehicleHotspotAssessmentProps>) {
  const [activeHotspot, setActiveHotspot] = useState<VehiclePart | null>(null);
  const [assessment, setAssessment] = useState<Hotspot[]>([]);

  useEffect(() => {
    onAssessment(assessment);
  }, [assessment, onAssessment]);

  const handleHotspotClick = (part: VehiclePart) => {
    setActiveHotspot(part);
  };

  const handleIssueSubmit = (issue: string) => {
    if (activeHotspot) {
      const newHotspot: Hotspot = { part: activeHotspot.name, issue };
      setAssessment(prev => [...prev.filter(h => h.part !== activeHotspot.name), newHotspot]);
      setActiveHotspot(null);
    }
  };

  return (
    <div className="relative w-full max-w-[800px] mx-auto">
      <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden shadow-lg bg-gray-200">
        <img src="/vehicle-outline.svg" alt="Vehicle Diagram" className="w-full h-full object-contain" />
        {vehicleParts.map((part, index) => (
          <Popover key={part.name}>
            <PopoverTrigger asChild>
              <button
                className={`absolute w-6 h-6 rounded-full ${assessment.some(h => h.part === part.name) ? 'bg-red-500' : 'bg-blue-500'
                  } hover:bg-opacity-80 transition-colors`}
                style={{ left: `${part.x}%`, top: `${part.y}%` }}
                onClick={() => handleHotspotClick(part)}
              />
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-2">
                <Label htmlFor="issue">Issue with {part.name}</Label>
                <Input
                  id="issue"
                  placeholder="Describe the issue"
                  defaultValue={assessment.find(h => h.part === part.name)?.issue || ''}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleIssueSubmit((e.target as HTMLInputElement).value);
                    }
                  }}
                />
                <Button onClick={() => handleIssueSubmit((document.getElementById('issue') as HTMLInputElement).value)}>
                  Submit
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        ))}
      </div>
      <div className="mt-4">
        <h3 className="font-bold">Reported Issues:</h3>
        <ul className="list-disc pl-5">
          {assessment.map((hotspot, index) => (
            <li key={index}>
              {hotspot.part}: {hotspot.issue}
            </li>
          ))}
        </ul>
      </div>
    </div >
  );
}