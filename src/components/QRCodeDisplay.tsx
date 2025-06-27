
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, QrCode } from 'lucide-react';

interface QRCodeDisplayProps {
  url: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ url }) => {
  // Generate QR code URL using a free service
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qrcode-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="p-6 text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <QrCode className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold">QR Code</h3>
      </div>
      
      <div className="mb-6">
        <img
          src={qrCodeUrl}
          alt="QR Code"
          className="mx-auto rounded-lg shadow-md"
          width={200}
          height={200}
        />
      </div>
      
      <Button
        onClick={downloadQRCode}
        variant="outline"
        className="w-full"
      >
        <Download className="w-4 h-4 mr-2" />
        Download QR Code
      </Button>
    </Card>
  );
};
