<<<<<<< HEAD
"use client"

import React, { useState, useCallback, useRef } from 'react';
import { useZxing } from 'react-zxing';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Spinner } from '@/components/SpinnerComponent';
import { usePermissions } from '@/hooks/usePermissions';

interface VINScannerProps {
  onVINScanned: (vin: string, vehicleDetails: any) => void;
  onError: (error: Error) => void;
}

export const VINScanner: React.FC<VINScannerProps> = ({ onVINScanned, onError }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const getVehicleDetails = useMutation(api.vehicles.getDetailsByVIN);
  const { hasPermission } = usePermissions();
  const scanAttemptsRef = useRef(0);

  const handleError = useCallback((error: Error) => {
    console.error("VIN scanning error:", error);
    toast({
      title: "Scanning Error",
      description: "Failed to scan VIN. Please try again.",
      variant: "destructive",
    });
    onError(error);
  }, [onError]);

  const handleScan = useCallback(async (result: string) => {
    setIsProcessing(true);
    try {
      const vehicleDetails = await getVehicleDetails({ vin: result });
      onVINScanned(result, vehicleDetails);
      toast({
        title: "VIN Scanned Successfully",
        description: `VIN: ${result}`,
      });
    } catch (error) {
      handleError(error as Error);
    } finally {
      setIsProcessing(false);
      setIsScanning(false);
    }
  }, [getVehicleDetails, onVINScanned, handleError]);

  const { ref } = useZxing({
    onDecodeResult: handleScan,
    onDecodeError: (error) => {
      scanAttemptsRef.current += 1;
      if (scanAttemptsRef.current > 10) {
        handleError(new Error("Maximum scan attempts reached"));
        setIsScanning(false);
      }
    },
    timeBetweenDecodingAttempts: 300,
  });

  const toggleScanning = () => {
    if (!hasPermission('scan_vin')) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to scan VINs.",
        variant: "destructive",
      });
      return;
    }
    setIsScanning(!isScanning);
    scanAttemptsRef.current = 0;
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>VIN Scanner</CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={toggleScanning}
          className="mb-4"
          disabled={isProcessing}
        >
          {isScanning ? "Stop Scanning" : "Scan VIN"}
        </Button>
        {isScanning && (
          <div className="mt-2 relative">
            <video ref={ref} className="w-full max-w-sm rounded-lg shadow-md" />
            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                <Spinner />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
=======
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
>>>>>>> c51587409a955418810f61cf695203e9470b93e5
  );
};