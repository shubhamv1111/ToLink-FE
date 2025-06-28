import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Link2, Lock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface CreateLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (linkData: any) => void;
  initialValues?: {
    urlName?: string;
    originalUrl?: string;
    customAlias?: string;
    isPrivate?: boolean;
    hasPassword?: boolean;
    password?: string;
  };
  editMode?: boolean;
}

export const CreateLinkModal: React.FC<CreateLinkModalProps> = ({ isOpen, onClose, onCreate, initialValues, editMode }) => {
  const [url, setUrl] = useState(initialValues?.originalUrl || '');
  const [customAlias, setCustomAlias] = useState(initialValues?.customAlias || '');
  const [urlName, setUrlName] = useState(initialValues?.urlName || '');
  const [isPrivate, setIsPrivate] = useState(initialValues?.isPrivate || false);
  const [hasPassword, setHasPassword] = useState(initialValues?.hasPassword || false);
  const [password, setPassword] = useState(initialValues?.password || '');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && initialValues) {
      setUrl(initialValues.originalUrl || '');
      setCustomAlias(initialValues.customAlias || '');
      setUrlName(initialValues.urlName || '');
      setIsPrivate(initialValues.isPrivate || false);
      setHasPassword(initialValues.hasPassword || false);
      setPassword(initialValues.password || '');
    }
  }, [isOpen, initialValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to shorten",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const linkData = {
        urlName,
        originalUrl: url,
        customAlias,
        isPrivate,
        hasPassword,
        password: hasPassword ? password : undefined
      };
      await onCreate(linkData);
      onClose();
      setUrl('');
      setCustomAlias('');
      setUrlName('');
      setIsPrivate(false);
      setHasPassword(false);
      setPassword('');
    } catch (error) {
      toast({
        title: "Error",
        description: editMode ? "Failed to update link" : "Failed to create link",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <Card className="w-full max-w-md p-6 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95">
        <div className="flex items-center gap-2 mb-6">
          <Link2 className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {editMode ? 'Edit Link' : 'Create New Link'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Link Name (optional)
            </label>
            <Input
              type="text"
              placeholder="My Important Link"
              value={urlName}
              onChange={(e) => setUrlName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Original URL *
            </label>
            <Input
              type="url"
              placeholder="https://example.com/very-long-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Custom Alias (optional)
            </label>
            <Input
              type="text"
              placeholder="my-custom-link"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Private Link</span>
              </div>
              <Switch
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Password Protection</span>
              </div>
              <Switch
                checked={hasPassword}
                onCheckedChange={setHasPassword}
              />
            </div>

            {hasPassword && (
              <div>
                <Input
                  type="text"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={hasPassword}
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading ? (editMode ? 'Saving...' : 'Creating...') : (editMode ? 'Save Changes' : 'Create Link')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );

  return createPortal(modalContent, document.body);
};
