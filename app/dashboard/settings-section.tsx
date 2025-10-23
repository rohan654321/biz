"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

export function SettingsSection() {
  const { toast } = useToast();

  const [settings, setSettings] = useState({
    profileVisibility: "Public",
    phoneNumber: "+1 (555) 123-4567",
    email: "user@example.com",
    introduceMe: true,
    emailNotifications: true,
    eventReminders: true,
    newMessages: true,
    connectionRequests: true,
  });

  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editingField, setEditingField] = useState<"phone" | "email" | "profile" | null>(null);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSavePhone = () => {
    if (editPhone.trim()) {
      setSettings((prev) => ({ ...prev, phoneNumber: editPhone }));
      setEditPhone("");
      setEditingField(null);
      toast({
        title: "Phone number updated",
        description: "Your phone number has been updated successfully.",
      });
    }
  };

  const handleSaveEmail = () => {
    if (editEmail.trim()) {
      setSettings((prev) => ({ ...prev, email: editEmail }));
      setEditEmail("");
      setEditingField(null);
      toast({
        title: "Email updated",
        description: "Your email has been updated successfully.",
      });
    }
  };

  const handleProfileVisibilityChange = (value: string) => {
    setSettings((prev) => ({ ...prev, profileVisibility: value }));
    toast({
      title: "Profile visibility updated",
      description: `Your profile is now ${value.toLowerCase()}.`,
    });
  };

  const handleEmailNotificationsToggle = () => {
    const newValue = !settings.emailNotifications;
    setSettings((prev) => ({ ...prev, emailNotifications: newValue }));
    toast({
      title: newValue ? "Email notifications enabled" : "Email notifications disabled",
      description: newValue 
        ? "You will receive event updates via email."
        : "You will no longer receive email notifications.",
    });
  };

  const cancelEdit = () => {
    setEditPhone("");
    setEditEmail("");
    setEditingField(null);
  };

  return (
    <div className="w-full px-6 py-6 space-y-10 bg-white">
      {/* ---- Privacy Settings ---- */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Privacy Settings</h2>
        <div className="space-y-5 text-sm">
          {/* Profile Visibility */}
          <div className="border-b pb-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-medium">Profile Visibility</div>
                <p className="text-gray-500">Who can see your profile</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">{settings.profileVisibility}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setEditingField(editingField === "profile" ? null : "profile")}
                >
                  {editingField === "profile" ? "Cancel" : "Edit"}
                </Button>
              </div>
            </div>
            
            {editingField === "profile" && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-3">
                <div className="flex gap-2">
                  {["Public", "Private", "Friends Only"].map((option) => (
                    <Button
                      key={option}
                      variant={settings.profileVisibility === option ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleProfileVisibilityChange(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Phone Number */}
          <div className="border-b pb-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-medium">Phone Number</div>
                <p className="text-gray-500">{settings.phoneNumber}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setEditingField(editingField === "phone" ? null : "phone")}
              >
                {editingField === "phone" ? "Cancel" : "Edit"}
              </Button>
            </div>
            
            {editingField === "phone" && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-3">
                <Input
                  placeholder="Enter new phone number"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button onClick={handleSavePhone} className="flex-1">
                    Save
                  </Button>
                  <Button variant="outline" onClick={cancelEdit} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Email ID */}
          <div className="border-b pb-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-medium">Email ID</div>
                <p className="text-gray-500">{settings.email}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setEditingField(editingField === "email" ? null : "email")}
              >
                {editingField === "email" ? "Cancel" : "Edit"}
              </Button>
            </div>
            
            {editingField === "email" && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-3">
                <Input
                  type="email"
                  placeholder="Enter new email address"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button onClick={handleSaveEmail} className="flex-1">
                    Save
                  </Button>
                  <Button variant="outline" onClick={cancelEdit} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Introduce Me */}
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <div className="font-medium">Introduce me</div>
              <p className="text-gray-500">
                We will introduce you to other users interested in similar events
              </p>
            </div>
            <Switch
              checked={settings.introduceMe}
              onCheckedChange={() => handleToggle("introduceMe")}
            />
          </div>

          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Email Notifications</div>
              <p className="text-gray-500">
                Receive event updates via email
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={handleEmailNotificationsToggle}
            />
          </div>
        </div>
      </section>

      {/* ---- Notification Preferences ---- */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
        <div className="space-y-5 text-sm">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <div className="font-medium">Event Reminders</div>
              <p className="text-gray-500">Get notified about upcoming events</p>
            </div>
            <Switch
              checked={settings.eventReminders}
              onCheckedChange={() => handleToggle("eventReminders")}
            />
          </div>

          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <div className="font-medium">New Messages</div>
              <p className="text-gray-500">Get notified about new messages</p>
            </div>
            <Switch
              checked={settings.newMessages}
              onCheckedChange={() => handleToggle("newMessages")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Connection Requests</div>
              <p className="text-gray-500">
                Get notified about new connection requests
              </p>
            </div>
            <Switch
              checked={settings.connectionRequests}
              onCheckedChange={() => handleToggle("connectionRequests")}
            />
          </div>
        </div>
      </section>

      {/* ---- Manage ---- */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Manage</h2>
        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between text-red-600 border-b pb-4">
            <div>
              <p className="font-medium">Deactivate my account</p>
              <p className="text-gray-500">Hide your profile from everywhere.</p>
            </div>
            <Button variant="ghost" className="text-gray-600">›</Button>
          </div>

          <div className="flex items-center justify-between text-red-600">
            <div>
              <p className="font-medium">Delete my account</p>
              <p className="text-gray-500">
                This will permanently delete your account and data.
              </p>
            </div>
            <Button variant="ghost" className="text-gray-600">›</Button>
          </div>
        </div>
      </section>
    </div>
  );
}