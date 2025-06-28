import React, { useState } from 'react';
import { Calendar, Eye, ExternalLink, Copy, Trash2, BarChart3, Lock, Globe, Shield, QrCode, Download, Edit, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { CreateLinkModal } from './CreateLinkModal';

interface UrlData {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
  lastClicked?: string;
  isPrivate: boolean;
  hasPassword: boolean;
  urlName?: string;
  password?: string;
}

interface UrlCardProps {
  url: UrlData;
  onCopy: (url: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updatedData: any) => void;
}

export const UrlCard: React.FC<UrlCardProps> = ({ url, onCopy, onDelete, onEdit }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const downloadQRCode = () => {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url.shortUrl)}`;
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qrcode-${url.shortCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEdit = (linkData: any) => {
    onEdit(url.id, {
      urlName: linkData.urlName,
      originalUrl: linkData.originalUrl,
      shortCode: linkData.customAlias,
      shortUrl: `https://tolink.co/${linkData.customAlias}`,
      isPrivate: linkData.isPrivate,
      hasPassword: linkData.hasPassword,
      password: linkData.hasPassword ? linkData.password : undefined
    });
    setShowEdit(false);
  };

  const openAnalytics = () => {
    router.push(`/analytics?url=${url.id}`);
  };

  const openLink = () => {
    window.open(url.shortUrl, '_blank');
  };

  const handleCopyPassword = async () => {
    if (url.password) {
      await navigator.clipboard.writeText(url.password);
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 1500);
    }
  };

  // --- Card Layout ---
  return (
    <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300">
      {/* Top: Short URL + QR + copy + privacy icons + password button (right) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 justify-between w-full">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-gray-900 dark:text-white truncate text-lg">
              {url.shortUrl}
            </span>
            {/* QR code button next to short URL */}
            <Dialog open={showQR} onOpenChange={setShowQR}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" title="Show QR Code">
                  <QrCode className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <QrCode className="w-5 h-5" />
                    QR Code for {url.shortCode}
                  </DialogTitle>
                </DialogHeader>
                <div className="text-center space-y-4">
                  <div className="bg-white p-4 rounded-lg shadow-md inline-block">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(url.shortUrl)}`}
                      alt={`QR Code for ${url.shortCode}`}
                      className="mx-auto"
                      width={250}
                      height={250}
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
                      onClick={() => onCopy(url.shortUrl)}
                      variant="outline"
                      className="flex-1"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy URL
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Scan this QR code to visit: {url.shortUrl}
                  </p>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCopy(url.shortUrl)}
              className="p-1 h-6 w-6"
              title="Copy short URL"
            >
              <Copy className="w-3 h-3" />
            </Button>
            <div className="flex gap-1">
              {url.isPrivate ? (
                <div title="Private Link - Only visible to you">
                  <Lock className="w-4 h-4 text-orange-500" />
                </div>
              ) : (
                <div title="Public Link - Visible to everyone">
                  <Globe className="w-4 h-4 text-green-500" />
                </div>
              )}
              {url.hasPassword && (
                <div title="Password Protected">
                  <Shield className="w-4 h-4 text-red-500" />
                </div>
              )}
            </div>
          </div>
          {/* Password Show Button with label (top right) */}
          {url.hasPassword && (
            <Dialog open={showPassword} onOpenChange={setShowPassword}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" title="Show Password" className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span className="text-xs">Password</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Password for {url.shortCode}
                  </DialogTitle>
                </DialogHeader>
                <div className="text-center space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Password:</p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-mono font-bold text-gray-900 dark:text-white">
                        {url.password || 'No password set'}
                      </span>
                      <Button size="icon" variant="ghost" onClick={handleCopyPassword} title="Copy Password">
                        {copiedPassword ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Share this password with users who need to access this protected link.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
        {/* Name (if any) */}
        {url.urlName && (
          <div className="text-base font-semibold text-blue-600 dark:text-blue-400 leading-tight">
            {url.urlName}
          </div>
        )}
        {/* Original URL */}
        <div className="text-sm text-gray-600 dark:text-gray-300 truncate">
          {url.originalUrl}
        </div>
      </div>

      {/* Bottom: meta and actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mt-4">
        {/* Meta info */}
        <div className="flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Created {formatDate(url.createdAt)}
          </span>
          {url.lastClicked && (
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              Last clicked {formatDate(url.lastClicked)}
            </span>
          )}
        </div>
        {/* Clicks and actions */}
        <div className="flex items-center gap-3 mt-2 md:mt-0">
          <div className="text-center min-w-[60px]">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {url.clicks.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">clicks</div>
          </div>
          {/* All actions in a row: Edit, Analytics, Goto, Delete (no eye here) */}
          <CreateLinkModal
            isOpen={showEdit}
            onClose={() => setShowEdit(false)}
            onCreate={handleEdit}
            initialValues={{
              urlName: url.urlName,
              originalUrl: url.originalUrl,
              customAlias: url.shortCode,
              isPrivate: url.isPrivate,
              hasPassword: url.hasPassword,
              password: url.password
            }}
            editMode={true}
          />
          <Button variant="outline" size="sm" title="Edit" onClick={() => setShowEdit(true)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={openAnalytics}
            title="Analytics"
          >
            <BarChart3 className="w-4 h-4 mr-1" />
            Analytics
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={openLink}
            title="Open Link"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(url.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
