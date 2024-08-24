// File: components/VINScanner.tsx

import React, { useEffect, useRef } from 'react';
import Quagga from 'quagga';

interface VINScannerProps {
  onScan: (vin: string) => void;
}

export const VINScanner: React.FC<VINScannerProps> = ({ onScan }) => {
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scannerRef.current) {
      Quagga.init({
        inputStream: {
          type: 'LiveStream',
          target: scannerRef.current,
        },
        decoder: {
          readers: ['code_128_reader'],
        },
      }, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        Quagga.start();
      });

      Quagga.onDetected((data) => {
        const vin = data.codeResult.code;
        onScan(vin);
        Quagga.stop();
      });

      return () => {
        Quagga.stop();
      };
    }
  }, [onScan]);

  return <div ref={scannerRef} style={{ width: '100%', height: '300px' }} />;
};