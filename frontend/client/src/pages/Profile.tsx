import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";

export const Profile = (): JSX.Element => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="w-full px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img
                className="w-8 h-8 mr-3"
                alt="Logo"
                src="/figmaAssets/image-4.svg"
              />
              <span className="[font-family:'Montserrat',Helvetica] font-medium text-black text-xl">
                Rayfield Systems
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" className="[font-family:'Montserrat',Helvetica] font-medium">
                  Back to Dashboard
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="[font-family:'Montserrat',Helvetica] font-medium">
                  Sign Out
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8 w-full">
        <div>
          <div className="mb-8">
            <h1 className="[font-family:'Montserrat',Helvetica] font-medium text-3xl text-gray-900 mb-2">
              Profile Settings
            </h1>
            <p className="[font-family:'Montserrat',Helvetica] font-normal text-gray-600">
              Manage your personal information and account preferences
            </p>
          </div>

          {/* Profile Form */}
          <Card>
            <CardHeader>
              <CardTitle className="[font-family:'Montserrat',Helvetica] font-medium text-xl">
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="[font-family:'Montserrat',Helvetica] font-medium">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="Enter your first name"
                    className="[font-family:'Montserrat',Helvetica] font-normal"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="[font-family:'Montserrat',Helvetica] font-medium">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Enter your last name"
                    className="[font-family:'Montserrat',Helvetica] font-normal"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="[font-family:'Montserrat',Helvetica] font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="[font-family:'Montserrat',Helvetica] font-normal"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="[font-family:'Montserrat',Helvetica] font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  className="[font-family:'Montserrat',Helvetica] font-normal"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="[font-family:'Montserrat',Helvetica] font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  className="[font-family:'Montserrat',Helvetica] font-normal"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  variant="outline"
                  className="[font-family:'Montserrat',Helvetica] font-medium"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-black hover:bg-black/80 [font-family:'Montserrat',Helvetica] font-medium"
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="[font-family:'Montserrat',Helvetica] font-medium text-xl">
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="[font-family:'Montserrat',Helvetica] font-medium">
                  Current Password
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  className="[font-family:'Montserrat',Helvetica] font-normal"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="[font-family:'Montserrat',Helvetica] font-medium">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  className="[font-family:'Montserrat',Helvetica] font-normal"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="[font-family:'Montserrat',Helvetica] font-medium">
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  className="[font-family:'Montserrat',Helvetica] font-normal"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  variant="outline"
                  className="[font-family:'Montserrat',Helvetica] font-medium"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-black hover:bg-black/80 [font-family:'Montserrat',Helvetica] font-medium"
                >
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};