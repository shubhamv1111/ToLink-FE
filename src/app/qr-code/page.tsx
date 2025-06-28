'use client'

import React, { useState } from 'react';
import { QrCode, Download, Settings, Link2, Text, Palette, Eye, EyeOff } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

const QRCodePage = () => {
  const [inputText, setInputText] = useState('');
  const [qrSize, setQrSize] = useState([200]);
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [showLogo, setShowLogo] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [logoSize, setLogoSize] = useState([20]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateQRCodeUrl = () => {
    if (!inputText.trim()) return '';
    
    const baseUrl = 'https://api.qrserver.com/v1/create-qr-code/';
    const params = new URLSearchParams({
      size: `${qrSize[0]}x${qrSize[0]}`,
      data: inputText,
      color: foregroundColor.replace('#', ''),
      bgcolor: backgroundColor.replace('#', ''),
      format: 'png',
      qzone: '2',
      margin: '0'
    });

    if (showLogo && logoUrl) {
      params.append('logo', logoUrl);
      params.append('logo_size', `${logoSize[0]}%`);
    }

    return `${baseUrl}?${params.toString()}`;
  };

  const downloadQRCode = () => {
    const qrCodeUrl = generateQRCodeUrl();
    if (!qrCodeUrl) {
      toast({
        title: "No QR Code",
        description: "Please enter some text or URL first",
        variant: "destructive",
      });
      return;
    }

    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qrcode-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Downloaded!",
      description: "QR Code has been downloaded successfully",
    });
  };

  const copyQRCodeUrl = async () => {
    const qrCodeUrl = generateQRCodeUrl();
    if (!qrCodeUrl) {
      toast({
        title: "No QR Code",
        description: "Please enter some text or URL first",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(qrCodeUrl);
      toast({
        title: "Copied!",
        description: "QR Code URL copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy QR Code URL",
        variant: "destructive",
      });
    }
  };

  const isValidUrl = (string: string) => {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  const qrCodeUrl = generateQRCodeUrl();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <QrCode className="w-4 h-4" />
            QR Code Generator
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Generate QR Codes
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Create custom QR codes for URLs, text, or any content. Download high-quality QR codes with your branding.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0">
              <div className="flex items-center gap-2 mb-4">
                <Link2 className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Content</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="input-text" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enter URL or Text *
                  </Label>
                  <Input
                    id="input-text"
                    type="text"
                    placeholder="https://example.com or any text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="mt-1"
                  />
                  {inputText && isValidUrl(inputText) && (
                    <p className="text-sm text-green-600 mt-1">✓ Valid URL detected</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Customization Options */}
            <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Customization</h2>
              </div>
              
              <div className="space-y-6">
                {/* Size */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    QR Code Size: {qrSize[0]}px
                  </Label>
                  <Slider
                    value={qrSize}
                    onValueChange={setQrSize}
                    max={400}
                    min={100}
                    step={10}
                    className="mt-2"
                  />
                </div>

                {/* Colors */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Foreground Color
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="color"
                        value={foregroundColor}
                        onChange={(e) => setForegroundColor(e.target.value)}
                        className="w-10 h-10 rounded border cursor-pointer"
                      />
                      <Input
                        value={foregroundColor}
                        onChange={(e) => setForegroundColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Background Color
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-10 h-10 rounded border cursor-pointer"
                      />
                      <Input
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Logo */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={showLogo}
                      onCheckedChange={setShowLogo}
                    />
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Add Logo
                    </Label>
                  </div>
                  
                  {showLogo && (
                    <div className="space-y-3 pl-6">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Logo URL
                        </Label>
                        <Input
                          type="url"
                          placeholder="https://example.com/logo.png"
                          value={logoUrl}
                          onChange={(e) => setLogoUrl(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Logo Size: {logoSize[0]}%
                        </Label>
                        <Slider
                          value={logoSize}
                          onValueChange={setLogoSize}
                          max={30}
                          min={5}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Preview</h2>
              </div>
              
              <div className="text-center">
                {qrCodeUrl ? (
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg shadow-md inline-block">
                      <img
                        src={qrCodeUrl}
                        alt="QR Code Preview"
                        className="mx-auto"
                        width={qrSize[0]}
                        height={qrSize[0]}
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={downloadQRCode}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PNG
                      </Button>
                      <Button
                        onClick={copyQRCodeUrl}
                        variant="outline"
                        className="flex-1"
                      >
                        Copy URL
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Enter text or URL above to generate QR code
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tips for Best Results</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Use high contrast colors for better scanning</li>
                <li>• Keep logo size under 30% for optimal readability</li>
                <li>• Test your QR code with multiple devices</li>
                <li>• Use HTTPS URLs for better security</li>
                <li>• Larger QR codes are easier to scan from distance</li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default QRCodePage; 