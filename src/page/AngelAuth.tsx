import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface FormValues {
  clientCode: string;
  password: string;
  totp: string;
  id: string;
}

export default function AngelAuth() {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState<FormValues>({
    id: "",
    clientCode: "",
    password: "",
    totp: "",
  });

  useEffect(() => {
    const queryParameters = new URLSearchParams(location.search);
    const id = queryParameters.get("id");
    if (id) {
      setFormValues((prev) => ({
        ...prev,
        id,
      }));
    }
  }, [location.search]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValues({
      ...formValues,
      [id]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_server_url}/api/angel/auth`,
        formValues,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      navigate("/dashboard");
    } catch (error) {
      console.error("Authentication failed", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center pt-14">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Angel Auth</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="clientCode">Client Code</Label>
                <Input
                  className="text-white"
                  id="clientCode"
                  placeholder="Enter your Angel Client Code"
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  className="text-white"
                  id="password"
                  type="password"
                  placeholder="Enter your Angel Password"
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="totp">TOTP</Label>
                <Input
                  className="text-white"
                  id="totp"
                  placeholder="Enter your Angel TOTP"
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-around">
            <Button type="submit">Login</Button>
          </CardFooter>
        </form>
        <a className="text-cyan-800 px-2 py-1" href="/register">
          Don't have an account?
        </a>
      </Card>
      <div className="text-white m-5 p-5 text-xl w-full">
        Steps to complete Angel auth:
        <br />
        1. Log in to your Angel account.
        <br />
        2. Generate your TOTP using your registered device.
        <br />
        3. Enter your Client Code, Password, and TOTP in the form above.
      </div>
    </div>
  );
}
