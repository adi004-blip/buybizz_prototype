"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Save, User, Mail, Lock, Bell, Shield } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function SettingsPage() {
  const { user } = useUser();
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.emailAddresses[0]?.emailAddress || "",
    company: "",
    bio: ""
  });

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    productAlerts: true,
    marketingEmails: false,
    securityAlerts: true
  });

  const handleSave = () => {
    // In real app, this would save to API
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-4xl">
        <h1 className="neo-heading text-5xl md:text-7xl mb-8">
          ACCOUNT <span className="text-pink-500">SETTINGS</span>
        </h1>

        {/* Profile Settings */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <User className="w-6 h-6" />
              <CardTitle className="neo-heading text-2xl">PROFILE INFORMATION</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="neo-text text-sm mb-2 block">FIRST NAME</label>
                <Input
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  placeholder="FIRST NAME"
                />
              </div>
              <div>
                <label className="neo-text text-sm mb-2 block">LAST NAME</label>
                <Input
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  placeholder="LAST NAME"
                />
              </div>
            </div>
            <div>
              <label className="neo-text text-sm mb-2 block">EMAIL ADDRESS</label>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-500" />
                <Input
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="EMAIL"
                  type="email"
                />
              </div>
            </div>
            <div>
              <label className="neo-text text-sm mb-2 block">COMPANY NAME (OPTIONAL)</label>
              <Input
                value={profile.company}
                onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                placeholder="COMPANY NAME"
              />
            </div>
            <div>
              <label className="neo-text text-sm mb-2 block">BIO (OPTIONAL)</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="TELL US ABOUT YOURSELF..."
                className="neo-input w-full min-h-[100px] resize-y"
              />
            </div>
            <Button onClick={handleSave} className="bg-yellow-400">
              <Save className="w-5 h-5 mr-2" />
              SAVE PROFILE
            </Button>
            {saved && (
              <p className="neo-text text-green-600">✓ PROFILE SAVED SUCCESSFULLY</p>
            )}
          </CardContent>
        </Card>

        {/* Password Settings */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6" />
              <CardTitle className="neo-heading text-2xl">PASSWORD & SECURITY</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="neo-text text-sm mb-2 block">CURRENT PASSWORD</label>
              <Input type="password" placeholder="ENTER CURRENT PASSWORD" />
            </div>
            <div>
              <label className="neo-text text-sm mb-2 block">NEW PASSWORD</label>
              <Input type="password" placeholder="ENTER NEW PASSWORD" />
            </div>
            <div>
              <label className="neo-text text-sm mb-2 block">CONFIRM NEW PASSWORD</label>
              <Input type="password" placeholder="CONFIRM NEW PASSWORD" />
            </div>
            <Button variant="outline">UPDATE PASSWORD</Button>
            <p className="neo-text text-xs text-gray-600">
              PASSWORD MUST BE AT LEAST 8 CHARACTERS LONG
            </p>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6" />
              <CardTitle className="neo-heading text-2xl">NOTIFICATION PREFERENCES</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-100 neo-border">
              <div>
                <p className="neo-heading">EMAIL UPDATES</p>
                <p className="neo-text text-sm text-gray-600">RECEIVE UPDATES ABOUT YOUR ACCOUNT</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.emailUpdates}
                  onChange={(e) => setNotifications({ ...notifications, emailUpdates: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-400 neo-border peer-checked:bg-yellow-400 relative"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-100 neo-border">
              <div>
                <p className="neo-heading">PRODUCT ALERTS</p>
                <p className="neo-text text-sm text-gray-600">GET NOTIFIED ABOUT NEW AI AGENTS</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.productAlerts}
                  onChange={(e) => setNotifications({ ...notifications, productAlerts: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-400 neo-border peer-checked:bg-yellow-400 relative"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-100 neo-border">
              <div>
                <p className="neo-heading">MARKETING EMAILS</p>
                <p className="neo-text text-sm text-gray-600">RECEIVE PROMOTIONAL EMAILS</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.marketingEmails}
                  onChange={(e) => setNotifications({ ...notifications, marketingEmails: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-400 neo-border peer-checked:bg-yellow-400 relative"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-100 neo-border">
              <div>
                <p className="neo-heading">SECURITY ALERTS</p>
                <p className="neo-text text-sm text-gray-600">IMPORTANT SECURITY NOTIFICATIONS</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.securityAlerts}
                  onChange={(e) => setNotifications({ ...notifications, securityAlerts: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-400 neo-border peer-checked:bg-yellow-400 relative"></div>
              </label>
            </div>
            <Button onClick={handleSave} variant="outline">SAVE NOTIFICATIONS</Button>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="bg-red-500 text-white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6" />
              <CardTitle className="neo-heading text-2xl text-white">DANGER ZONE</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-black/20 neo-border">
              <div>
                <p className="neo-heading">DELETE ACCOUNT</p>
                <p className="neo-text text-sm">PERMANENTLY DELETE YOUR ACCOUNT AND ALL DATA</p>
              </div>
              <Button variant="outline" className="bg-white text-red-500 border-white">
                DELETE ACCOUNT
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
