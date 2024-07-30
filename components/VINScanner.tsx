// components/VINScanner.tsx

import { VehicleInfo } from '@/types/vehicleInfo';
import React, { useState } from 'react';

interface VINScannerProps {
  onVINDecoded: (vehicleInfo: VehicleInfo) => void;
}

export const VINScanner: React.FC<VINScannerProps> = ({ onVINDecoded }) => {
  const [error, setError] = useState<string | null>(null);

  const { ref } = useZxing({
    onDecodeResult: async (result) => {
      const vin = result.getText();
      try {
        const vehicleInfo = await decodeVIN(vin);
        onVINDecoded(vehicleInfo);
      } catch (error) {
        setError('Error decoding VIN. Please try again or enter manually.');
      }
    },
    onError: (error) => {
      console.error('Barcode scanning error:', error);
      setError('Error scanning barcode. Please try again or enter VIN manually.');
    },
  });

  const decodeVIN = async (vin: string): Promise<VehicleInfo> => {
    const response = await axios.get(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`
    );

    if (response.data.Results && response.data.Results.length > 0) {
      const result = response.data.Results[0];
      return {
        VIN: result.VIN,
        Make: result.Make,
        Model: result.Model,
        ModelYear: result.ModelYear,
        VehicleType: result.VehicleType,
        BodyClass: result.BodyClass,
        DriveType: result.DriveType,
        EngineType: `${result.EngineConfiguration} ${result.EngineCylinders} cylinder`,
        EngineCylinders: result.EngineCylinders,
        EngineDisplacementCC: result.DisplacementCC,
        EngineDisplacementL: result.DisplacementL,
        FuelTypePrimary: result.FuelTypePrimary,
        GrossVehicleWeightRating: result.GVWR,
        BrakeSystemType: result.BrakeSystemType,
        CurbWeight: result.CurbWeight,
        TrailerType: result.TrailerType,
        BatteryInfo: result.BatteryInfo,
        ElectrificationLevel: result.ElectrificationLevel,
        Trim: result.Trim,
        Series: result.Series,
        PlantCountry: result.PlantCountry,
        PlantCity: result.PlantCity,
        TransmissionStyle: result.TransmissionStyle,
        TransmissionSpeeds: result.TransmissionSpeeds,
        SeatBeltType: result.SeatBeltType,
        AirBagLocations: result.AirBagLocations,
        PretensionerInfo: result.Pretensioner,
        TirePressureMonitoringSystemType: result.TirePressureMonitoringSystemType,
        ActiveSafetySystemNote: result.ActiveSafetySystemNote,
        NCSABodyType: result.NCSABodyType,
        NCSAMake: result.NCSAMake,
        NCSAModel: result.NCSAModel,
      };
    } else {
      throw new Error('No vehicle information found');
    }
  };

  return (
    <div>
      <video ref={ref} />
      {error && <p className="text-red-500">{error}</p>}
      <p>Position the VIN barcode within the scanner area</p>
    </div>
  );
};