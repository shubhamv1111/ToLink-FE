import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link2, Shield, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { TimePicker } from '@/components/ui/time-picker';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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
    activationAt?: string;
    expiresAt?: string;
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
  const [enableActivation, setEnableActivation] = useState<boolean>(false);
  const [activationDate, setActivationDate] = useState<Date | undefined>(undefined);
  const [activationTime, setActivationTime] = useState<string>('');
  const [enableExpiration, setEnableExpiration] = useState<boolean>(false);
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(undefined);
  const [expirationTime, setExpirationTime] = useState<string>('');
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const initializedRef = useRef(false);
  useEffect(() => {
    if (!isOpen) {
      initializedRef.current = false;
      return;
    }
    if (initializedRef.current) return;
    if (initialValues) {
      setUrl(initialValues.originalUrl || '');
      setCustomAlias(initialValues.customAlias || '');
      setUrlName(initialValues.urlName || '');
      setIsPrivate(initialValues.isPrivate || false);
      setHasPassword(initialValues.hasPassword || false);
      setPassword(initialValues.password || '');
      // Setup activation/expiration defaults from initial values
      if (initialValues.activationAt) {
        const d = new Date(initialValues.activationAt);
        setEnableActivation(true);
        setActivationDate(d);
        setActivationTime(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
      } else {
        setEnableActivation(false);
        setActivationDate(undefined);
        setActivationTime('');
      }
      if (initialValues.expiresAt) {
        const d = new Date(initialValues.expiresAt);
        setEnableExpiration(true);
        setExpirationDate(d);
        setExpirationTime(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
      } else {
        setEnableExpiration(false);
        setExpirationDate(undefined);
        setExpirationTime('');
      }
    } else {
      // For new links: auto-set privacy based on auth
      setIsPrivate(!!isAuthenticated);
      setHasPassword(false);
      setPassword('');
      setEnableActivation(false);
      setActivationDate(undefined);
      setActivationTime('');
      setEnableExpiration(false);
      setExpirationDate(undefined);
      setExpirationTime('');
    }
    initializedRef.current = true;
  }, [isOpen, initialValues, isAuthenticated]);

  const buildIsoFromDateTime = (dateObj?: Date, timeString?: string): string | undefined => {
    if (!dateObj) return undefined;
    const d = new Date(dateObj);
    const [hh, mm] = (timeString || '00:00').split(':');
    d.setHours(Number(hh || 0), Number(mm || 0), 0, 0);
    return d.toISOString();
  };

  const combineDateAndTime = (dateObj?: Date, timeString?: string): Date | undefined => {
    if (!dateObj) return undefined;
    const d = new Date(dateObj);
    const [hh, mm] = (timeString || '00:00').split(':');
    d.setHours(Number(hh || 0), Number(mm || 0), 0, 0);
    return d;
  };

  const isDateInPast = (date: Date): boolean => {
    return date.getTime() < Date.now();
  };

  const isDateBeforeToday = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() < today.getTime();
  };

  const startOfDay = (date: Date): Date => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const isDayBefore = (a: Date, b: Date): boolean => {
    return startOfDay(a).getTime() < startOfDay(b).getTime();
  };

  const isDayAfter = (a: Date, b: Date): boolean => {
    return startOfDay(a).getTime() > startOfDay(b).getTime();
  };

  const getNowPlusOneMinuteHHMM = (): string => {
    const now = new Date();
    now.setSeconds(0, 0);
    now.setMinutes(now.getMinutes() + 1);
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const handleActivationDateSelect = (d?: Date) => {
    if (!d) {
      setActivationDate(undefined);
      return;
    }
    setActivationDate(d);
    const combined = combineDateAndTime(d, activationTime || '00:00');
    if (combined && isDateInPast(combined)) {
      // Auto-correct to a safe future time (ceil to next minute)
      const corrected = getNowPlusOneMinuteHHMM();
      setActivationTime(corrected);
      toast({
        title: "Activation time adjusted",
        description: "Time cannot be in the past. We've set it to the current time.",
        variant: "destructive",
      });
    }
    // Same-day guard: activation cannot be after expiration
    if (enableExpiration && expirationDate && !isDayAfter(d, expirationDate) && !isDayBefore(d, expirationDate)) {
      const act = combineDateAndTime(d, activationTime || '00:00');
      const exp = combineDateAndTime(expirationDate, expirationTime || '00:00');
      if (act && exp && act.getTime() > exp.getTime()) {
        setActivationTime(expirationTime || '00:00');
        toast({
          title: "Invalid activation time",
          description: "Activation cannot be after expiration on the same day.",
          variant: "destructive",
        });
      }
    }
  };

  const handleActivationTimeChange = (t: string) => {
    setActivationTime(t);
    if (activationDate) {
      const combined = combineDateAndTime(activationDate, t);
      if (combined && isDateInPast(combined)) {
        const corrected = getNowPlusOneMinuteHHMM();
        setActivationTime(corrected);
        toast({
          title: "Activation time invalid",
          description: "Time cannot be in the past. We've set it to the current time.",
          variant: "destructive",
        });
        return;
      }
      // Same-day guard vs expiration
      if (enableExpiration && expirationDate && !isDayAfter(activationDate, expirationDate) && !isDayBefore(activationDate, expirationDate)) {
        const exp = combineDateAndTime(expirationDate, expirationTime || '00:00');
        const act = combined;
        if (act && exp && act.getTime() > exp.getTime()) {
          setActivationTime(expirationTime || t);
          toast({
            title: "Invalid activation time",
            description: "Activation cannot be after expiration on the same day.",
            variant: "destructive",
          });
        }
      }
    }
  };

  const handleExpirationDateSelect = (d?: Date) => {
    if (!d) {
      setExpirationDate(undefined);
      return;
    }
    setExpirationDate(d);
    const combined = combineDateAndTime(d, expirationTime || '00:00');
    if (combined && isDateInPast(combined)) {
      const corrected = getNowPlusOneMinuteHHMM();
      setExpirationTime(corrected);
      toast({
        title: "Expiration time adjusted",
        description: "Time cannot be in the past. We've set it to the current time.",
        variant: "destructive",
      });
    }
    // Same-day guard: expiration cannot be before activation
    if (enableActivation && activationDate && !isDayAfter(activationDate, d) && !isDayBefore(activationDate, d)) {
      const act = combineDateAndTime(activationDate, activationTime || '00:00');
      const exp = combineDateAndTime(d, expirationTime || '00:00');
      if (act && exp && exp.getTime() < act.getTime()) {
        setExpirationTime(activationTime || '00:00');
        toast({
          title: "Invalid expiration time",
          description: "Expiration cannot be before activation on the same day.",
          variant: "destructive",
        });
      }
    }
  };

  const handleExpirationTimeChange = (t: string) => {
    setExpirationTime(t);
    if (expirationDate) {
      const combined = combineDateAndTime(expirationDate, t);
      if (combined && isDateInPast(combined)) {
        const corrected = getNowPlusOneMinuteHHMM();
        setExpirationTime(corrected);
        toast({
          title: "Expiration time invalid",
          description: "Time cannot be in the past. We've set it to the current time.",
          variant: "destructive",
        });
        return;
      }
      // Same-day guard vs activation
      if (enableActivation && activationDate && !isDayAfter(activationDate, expirationDate) && !isDayBefore(activationDate, expirationDate)) {
        const act = combineDateAndTime(activationDate, activationTime || '00:00');
        const exp = combined;
        if (act && exp && exp.getTime() < act.getTime()) {
          setExpirationTime(activationTime || t);
          toast({
            title: "Invalid expiration time",
            description: "Expiration cannot be before activation on the same day.",
            variant: "destructive",
          });
        }
      }
    }
  };

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

    // Validate scheduling rules before proceeding
    const activationDt = enableActivation ? combineDateAndTime(activationDate, activationTime) : undefined;
    const expirationDt = enableExpiration ? combineDateAndTime(expirationDate, expirationTime) : undefined;

    if (enableActivation) {
      if (!activationDate) {
        toast({
          title: "Activation date required",
          description: "Please select an activation date (and optional time)",
          variant: "destructive",
        });
        return;
      }
      if (activationDt && isDateInPast(activationDt)) {
        toast({
          title: "Invalid activation time",
          description: "Activation must not be earlier than the current time",
          variant: "destructive",
        });
        return;
      }
    }

    if (enableExpiration) {
      if (!expirationDate) {
        toast({
          title: "Expiration date required",
          description: "Please select an expiration date (and optional time)",
          variant: "destructive",
        });
        return;
      }
      if (expirationDt && isDateInPast(expirationDt)) {
        toast({
          title: "Invalid expiration time",
          description: "Expiration must not be earlier than the current time",
          variant: "destructive",
        });
        return;
      }
    }

    if (activationDt && expirationDt && activationDt.getTime() > expirationDt.getTime()) {
      toast({
        title: "Invalid schedule",
        description: "Activation time cannot be after expiration time",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const linkData = {
        urlName,
        originalUrl: url,
        customAlias: customAlias || undefined, // Send undefined if empty
        // Auto-assign privacy: if logged in -> private, else public
        isPrivate,
        hasPassword,
        password: hasPassword ? password : undefined,
        activationAt: enableActivation ? buildIsoFromDateTime(activationDate, activationTime) : undefined,
        expiresAt: enableExpiration ? buildIsoFromDateTime(expirationDate, expirationTime) : undefined
      };
      await onCreate(linkData);
      // Only close and reset on success
      onClose();
      setUrl('');
      setCustomAlias('');
      setUrlName('');
      setIsPrivate(false);
      setHasPassword(false);
      setPassword('');
      setEnableActivation(false);
      setActivationDate(undefined);
      setActivationTime('');
      setEnableExpiration(false);
      setExpirationDate(undefined);
      setExpirationTime('');
    } catch (error: any) {
      // Show error but keep modal open so user can fix the issue
      const errorMsg = error?.message || (editMode ? "Failed to update link" : "Failed to create link");
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
        duration: 5000, // Show error for longer
      });
      // Don't close modal, let user fix the issue
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

          {/* Activation Date-Time */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Activation Schedule</span>
              </div>
              <Switch
                checked={enableActivation}
                onCheckedChange={(checked) => {
                  setEnableActivation(checked);
                  if (!checked) {
                    setActivationDate(undefined);
                    setActivationTime('');
                  }
                }}
              />
            </div>
            {enableActivation && (
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" type="button" className="justify-start font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {activationDate ? activationDate.toLocaleDateString() : 'Pick date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                      mode="single"
                      selected={activationDate}
                       onSelect={(d) => handleActivationDateSelect(d as Date)}
                       disabled={(d) => {
                         const day = d as Date;
                         if (isDateBeforeToday(day)) return true;
                         if (enableExpiration && expirationDate && isDayAfter(day, expirationDate)) return true;
                         return false;
                       }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <TimePicker
                  value={activationTime}
                  onChange={handleActivationTimeChange}
                />
              </div>
            )}
          </div>

          {/* Expiration Date-Time */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Expiration</span>
              </div>
              <Switch
                checked={enableExpiration}
                onCheckedChange={(checked) => {
                  setEnableExpiration(checked);
                  if (!checked) {
                    setExpirationDate(undefined);
                    setExpirationTime('');
                  }
                }}
              />
            </div>
            {enableExpiration && (
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" type="button" className="justify-start font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {expirationDate ? expirationDate.toLocaleDateString() : 'Pick date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                      mode="single"
                      selected={expirationDate}
                       onSelect={(d) => handleExpirationDateSelect(d as Date)}
                       disabled={(d) => {
                         const day = d as Date;
                         if (isDateBeforeToday(day)) return true;
                         if (enableActivation && activationDate && isDayBefore(day, activationDate)) return true;
                         return false;
                       }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <TimePicker
                  value={expirationTime}
                  onChange={handleExpirationTimeChange}
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
