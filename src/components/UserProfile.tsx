'use client'

import React, { useState, useRef } from 'react';
import { User, Camera, Edit, Save, X, LogOut, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { authApi } from '@/lib/api';

export const UserProfile = () => {
  const { user, logout, updateProfile, updateProfilePhoto } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleEdit = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || ''
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || '',
      email: user?.email || ''
    });
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const success = await updateProfile({
        name: formData.name,
        email: formData.email
      });
      
      if (success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully",
        });
        setIsEditing(false);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate file upload - in real app, upload to server
      const reader = new FileReader();
      reader.onload = async (e) => {
        const photoUrl = e.target?.result as string;
        const success = await updateProfilePhoto(photoUrl);
        
        if (success) {
          toast({
            title: "Photo Updated",
            description: "Your profile photo has been updated",
          });
        } else {
          throw new Error('Failed to update photo');
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "New password and confirm password must match",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await authApi.changePassword(passwordData.currentPassword, passwordData.newPassword);
      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully",
      });
      setShowChangePassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to change password. Please check your current password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0">
      <div className="flex items-start justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h2>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Photo Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.profilePhoto} alt={user.name} />
              <AvatarFallback className="text-2xl">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              variant="outline"
              className="absolute -bottom-2 -right-2 w-8 h-8 p-0 rounded-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
            Click camera icon to upload photo
          </p>
        </div>

        {/* Profile Details Section */}
        <div className="flex-1 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Name
            </label>
            {isEditing ? (
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your name"
                disabled={isLoading}
              />
            ) : (
              <p className="text-gray-900 dark:text-white">{user.name}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Email
            </label>
            {isEditing ? (
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                disabled={isLoading}
              />
            ) : (
              <p className="text-gray-900 dark:text-white">{user.email}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Member Since
            </label>
            <p className="text-gray-600 dark:text-gray-300">
              {new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Change Password
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowChangePassword(!showChangePassword)}
          >
            {showChangePassword ? 'Cancel' : 'Change Password'}
          </Button>
        </div>

        {showChangePassword && (
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Current Password
              </label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                New Password
              </label>
              <div className="relative">
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter new password (min 8 characters)"
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Confirm New Password
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              onClick={handleChangePassword}
              disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
              className="w-full"
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}; 