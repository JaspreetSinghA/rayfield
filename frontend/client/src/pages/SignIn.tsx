import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";

export const SignIn = (): JSX.Element => {
  const formFields = [
    { id: "username", placeholder: "Username", type: "text" },
    { id: "password", placeholder: "Password", type: "password" },
  ];

  return (
    <div className="bg-white w-full min-h-screen">
      <div className="bg-white overflow-hidden w-full h-screen relative flex">
        {/* Left side - White section with login form */}
        <div className="w-1/2 h-full bg-white flex flex-col justify-center items-center px-16 relative">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <h1 className="[font-family:'Montserrat',Helvetica] font-medium text-black text-4xl mb-4">
                Welcome Back!
              </h1>
              <p className="[font-family:'Montserrat',Helvetica] font-normal text-gray-600 text-base">
                Please enter your credentials to log in
              </p>
            </div>

            <div className="space-y-6">
              <Input
                id={formFields[0].id}
                type={formFields[0].type}
                placeholder={formFields[0].placeholder}
                className="w-full px-4 py-3 [font-family:'Montserrat',Helvetica] font-normal text-[#727374] text-sm rounded-xl border border-solid border-[#3d3e3e]"
              />
              
              <Input
                id={formFields[1].id}
                type={formFields[1].type}
                placeholder={formFields[1].placeholder}
                className="w-full px-4 py-3 [font-family:'Montserrat',Helvetica] font-normal text-[#727374] text-sm rounded-xl border border-solid border-[#3d3e3e]"
              />
              
              <div className="text-left">
                <button className="[font-family:'Montserrat',Helvetica] font-medium text-black text-sm hover:underline">
                  Forgot password?
                </button>
              </div>
              
              <Link href="/dashboard">
                <Button className="w-full h-12 bg-black hover:bg-black/80 rounded-xl">
                  <span className="[font-family:'Montserrat',Helvetica] font-bold text-white text-sm">
                    SIGN IN
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right side - Black section with branding */}
        <div className="w-1/2 h-full bg-black flex flex-col justify-center items-center px-16 relative">
          <div className="text-center mb-8">
            <h1 className="[font-family:'Montserrat',Helvetica] font-medium text-white text-5xl mb-4">
              Rayfield Systems
            </h1>
          </div>

          <div className="text-center mb-8">
            <p className="[font-family:'Montserrat',Helvetica] font-medium text-white text-base">
              New to our platform? Sign Up now.
            </p>
          </div>

          <Link href="/signup">
            <Button
              variant="outline"
              className="w-48 h-12 rounded-xl border border-solid border-white bg-transparent hover:bg-white hover:text-black transition-colors"
            >
              <span className="[font-family:'Montserrat',Helvetica] font-bold text-sm">
                SIGN UP
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};