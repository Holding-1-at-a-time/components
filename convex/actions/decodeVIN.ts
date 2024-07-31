// File: convex/actions/decodeVIN.ts

import { action } from './_generated/server';
import fetch from 'node-fetch';

export const decodeVIN = action({
  args: { vin: 'string' },
  handler: async (ctx, args) => {
    const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${args.vin}?format=json`);
    const data = await response.json();
    const vehicleData = data.Results.reduce((acc, item) => {
      if (item.Variable === 'Make') acc.make = item.Value;
      if (item.Variable === 'Model') acc.model = item.Value;
      if (item.Variable === 'Model Year') acc.year = parseInt(item.Value, 10);
      if (item.Variable === 'Plant Country') acc.plantCountry = item.Value;
      if (item.Variable === 'Plant City') acc.plantCity = item.Value;
      if (item.Variable === 'Manufacturer Name') acc.manufacturerName = item.Value;
      if (item.Variable === 'GVWR') acc.gvwrClass = item.Value;
      if (item.Variable === 'Engine Displacement (L)') acc.engineDisplacement = parseFloat(item.Value);
      if (item.Variable === 'Engine Number of Cylinders') acc.numberOfCylinders = parseInt(item.Value, 10);
      return acc;
    }, {});
    return vehicleData;
  },
});