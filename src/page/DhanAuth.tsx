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
    access_token: string;
    dhanClientId: string;
    id: string;
  }
  

export default function DhanAuth() {

    const navigate = useNavigate();
  
    const [formValues, setFormValues] = useState<FormValues>({
      id:"",
      access_token: "",
      dhanClientId: "",
    });

    useEffect(() => {
        const queryParameters = new URLSearchParams(location.search);
        const id = queryParameters.get("id");
        if(id){
            setFormValues(prev=>{
                return {...prev,
                id}
            })
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
      // Handle form submission logic here
      const response = await axios.post(
        `${import.meta.env.VITE_server_url}/api/dhan/auth`,
        formValues,
        {
          withCredentials: true, // Ensure cookies are sent with the request
        }
      );
      console.log(response);
      navigate("/dashboard");
    };
  
    return (
      <div className="flex flex-col items-center justify-center pt-14">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Dhan Auth</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="access_token">Access Token</Label>
                  <Input
                    className="text-white"
                    id="access_token"
                    placeholder="enter your Dhan Access Token"
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="dhanClientId">Dhan Client Id</Label>
                  <Input
                    className="text-white"
                    id="dhanClientId"
                    placeholder="enter your Dhan Client Id"
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
          Notes & Disclaimer:
          <br />
          1. Stoploss and Trailing Stoploss feature will only work if OiDelta
          trading window is opened.
          <br />
          2. Stoploss and Trailing Stoploss will be removed if OiDelta window has
          been reloaded.
          <br />
          3. We are not responsible for any of Losses you may incur by using
          OiDelta.
          <br />
          4. We are not SEBI registered investment/financial advisers. Please
          consult your investment/financial adviser before trading/investing.
        </div>
      </div>
    );
}
