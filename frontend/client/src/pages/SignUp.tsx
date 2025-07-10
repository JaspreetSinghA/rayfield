import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";

export const SignUp = (): JSX.Element => {
  // Data for form fields
  const formFields = [
    { id: "username", placeholder: "Username", type: "text" },
    { id: "email", placeholder: "Email", type: "email" },
    { id: "password", placeholder: "Password", type: "password" },
    { id: "confirmPassword", placeholder: "Confirm Password", type: "password" },
  ];

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white overflow-hidden w-[930px] h-[575px] relative">
        {/* Right side - Black section with branding */}
        <div className="absolute w-[469px] h-[575px] top-0 left-[465px] bg-black rounded-[40px_0px_0px_40px] overflow-hidden">
          <div className="absolute w-[264px] h-[157px] top-[119px] left-[102px]">
            <div className="relative h-[157px] top-[39px]">
              <div className="absolute w-[264px] h-[157px] top-0 left-0">
                <div className="absolute w-[250px] top-[33px] left-[35px] [font-family:'Montserrat',Helvetica] font-medium text-white text-[50px] tracking-[0] leading-[70px]">
                  Rayfield
                  <br />
                  Systems
                </div>

                <img
                  className="absolute w-[58px] h-[55px] top-[-39px] left-[103px] object-cover"
                  alt="Logo"
                  src="/figmaAssets/image-4.svg"
                />
              </div>
            </div>
          </div>

          <div className="absolute w-[231px] top-[359px] left-[119px] [font-family:'Montserrat',Helvetica] font-medium text-white text-[13px] tracking-[0] leading-[18.2px]">
            Already have an account? Sign In now.
          </div>

          <Link href="/">
            <Button
              variant="outline"
              className="absolute w-[185px] h-[42px] top-[408px] left-[142px] rounded-[15px] border border-solid border-white bg-black hover:bg-black/80 hover:text-white"
            >
              <span className="[font-family:'Montserrat',Helvetica] font-bold text-white text-[13px] tracking-[0] leading-[18.2px]">
                SIGN IN
              </span>
            </Button>
          </Link>
        </div>

        {/* Left side - White section with signup form */}
        <div className="absolute top-[102px] left-[102px] [font-family:'Montserrat',Helvetica] font-medium text-black text-3xl tracking-[0] leading-[42px]">
          Create Account
        </div>

        <div className="absolute top-[152px] left-[115px] [font-family:'Montserrat',Helvetica] font-normal text-black text-xs tracking-[0] leading-[16.8px]">
          Please fill in your details to create an account
        </div>

        <Card className="absolute top-[184px] left-[95px] border-none shadow-none">
          <CardContent className="p-0">
            <Input
              id={formFields[0].id}
              type={formFields[0].type}
              placeholder={formFields[0].placeholder}
              className="w-[269px] px-4 py-3 [font-family:'Montserrat',Helvetica] font-normal text-[#727374] text-[13px] tracking-[0] leading-[18.2px] rounded-xl border border-solid border-[#3d3e3e]"
            />
          </CardContent>
        </Card>

        <Card className="absolute top-[235px] left-[94px] border-none shadow-none">
          <CardContent className="p-0">
            <Input
              id={formFields[1].id}
              type={formFields[1].type}
              placeholder={formFields[1].placeholder}
              className="w-[269px] px-4 py-3 [font-family:'Montserrat',Helvetica] font-normal text-[#727374] text-[13px] tracking-[0] leading-[18.2px] rounded-xl border border-solid border-[#3d3e3e]"
            />
          </CardContent>
        </Card>

        <Card className="absolute top-[286px] left-[94px] border-none shadow-none">
          <CardContent className="p-0">
            <Input
              id={formFields[2].id}
              type={formFields[2].type}
              placeholder={formFields[2].placeholder}
              className="w-[269px] px-4 py-3 [font-family:'Montserrat',Helvetica] font-normal text-[#727374] text-[13px] tracking-[0] leading-[18.2px] rounded-xl border border-solid border-[#3d3e3e]"
            />
          </CardContent>
        </Card>

        <Card className="absolute top-[337px] left-[94px] border-none shadow-none">
          <CardContent className="p-0">
            <Input
              id={formFields[3].id}
              type={formFields[3].type}
              placeholder={formFields[3].placeholder}
              className="w-[269px] px-4 py-3 [font-family:'Montserrat',Helvetica] font-normal text-[#727374] text-[13px] tracking-[0] leading-[18.2px] rounded-xl border border-solid border-[#3d3e3e]"
            />
          </CardContent>
        </Card>

        <Link href="/dashboard">
          <Button className="absolute w-[267px] h-[42px] top-[420px] left-24 bg-black hover:bg-black/80 rounded-[15px]">
            <span className="[font-family:'Montserrat',Helvetica] font-bold text-white text-[13px] tracking-[0] leading-[18.2px]">
              CREATE ACCOUNT
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
};