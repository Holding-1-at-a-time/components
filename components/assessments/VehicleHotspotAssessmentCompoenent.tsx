"use client";

import { SetStateAction, AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, JSX, SVGProps, SetStateAction, AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, JSX, SVGProps, SetStateAction, useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { XIcon } from "@/public/Icons";

interface Part {
    name: string;
  }
  

export default function Component() {
  const [activeHotspot, setActiveHotspot] = useState(null);
  
  const handleHotspotClick = (part: SetStateAction<null>: SetStateAction<null>: SetStateAction<null>) => {
    setActiveHotspot(part);
  };
  
  const handleCloseHotspot = () => {
    setActiveHotspot(null);
  };
  
  const vehicleParts = [
    {
      name: "Exterior",
      services: [
        { name: "Wash & Wax", price: 49.99 },
        { name: "Paint Correction", price: 199.99 },
        { name: "Headlight Restoration", price: 79.99 },
      ],
    },
    {
      name: "Interior",
      services: [
        { name: "Vacuum & Shampoo", price: 59.99 },
        { name: "Leather Conditioning", price: 89.99 },
        { name: "Odor Elimination", price: 39.99 },
      ],
    },
    {
      name: "Wheels & Tires",
      services: [
        { name: "Wheel Cleaning", price: 29.99 },
        { name: "Tire Dressing", price: 19.99 },
        { name: "Brake Cleaning", price: 39.99 },
      ],
    },
    {
      name: "Engine Bay",
      services: [
        { name: "Engine Degreasing", price: 79.99 },
        { name: "Engine Detailing", price: 99.99 },
        { name: "Engine Steam Cleaning", price: 149.99 },
      ],
    },
  ];

  return (
    <div className="relative w-full max-w-[800px] mx-auto">
      <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden shadow-lg animated-3d gradient-bg">
        <div className="absolute inset-0 bg-gradient-radial from-[#00AE98] to-[#00AE98]/50 z-0" />
        <img src="/placeholder.svg" alt="Vehicle Diagram" className="object-contain z-10" />
        {vehicleParts.map((part, index) => (
          <div
            key={index}
            className="absolute w-12 h-12 rounded-full bg-[#00AE98]/50 cursor-pointer transition-all hover:scale-110 hover:bg-[#00AE98]/70 shadow-md z-20"
            style={{ left: `${Math.random() * 80}%`, top: `${Math.random() * 80}%` }}
            onClick={() => handleHotspotClick(part)}
          >
            <div className="flex items-center justify-center h-full text-white font-bold">{part.name[0]}</div>
          </div>
        ))}
      </div>
      {activeHotspot && (
        <Popover open onOpenChange={handleCloseHotspot}>
          <PopoverTrigger asChild>
            <div className="absolute w-12 h-12 rounded-full bg-[#00AE98]/50 cursor-pointer transition-all hover:scale-110 hover:bg-[#00AE98]/70 shadow-md z-20">
              <div className="flex items-center justify-center h-full text-white font-bold">
                {activeHotspot.name[0]}
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-4 bg-background shadow-lg rounded-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{activeHotspot.name}</h3>
              <Button variant="ghost" size="icon" className="hover:bg-muted" onClick={handleCloseHotspot}>
                <XIcon className="w-5 h-5" />
              </Button>
            </div>
            <div className="grid gap-4">
              {activeHotspot.services.map((service: { name: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; price: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }: { nam: Key | null | undefinede: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; price: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }, index: Key | null | undefined) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="font-medium">{service.name}</div>
                  <div className="font-bold text-[#00AE98]">${service.price}</div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}

function XIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
