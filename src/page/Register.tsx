import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface FormValues {
  name : string
  email: string;
  password: string;
  re_password: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<FormValues>({
    name:'',
    email: '',
    password: '',
    re_password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValues({
      ...formValues,
      [id]: value
    });
  };

  const handleSubmit =  async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    const response =await axios.post( `${import.meta.env.VITE_server_url}/api/register`,formValues)
    
    if(response){
      console.log(response)
      navigate('/login');
    }
     
  };

  return (
    <div className="flex justify-center flex-col items-center">
      <div className="text-5xl font-bold text-white p-7">Oi DELTA</div>

       <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Create your account</CardDescription>
      </CardHeader>
        <form onSubmit={handleSubmit}>
      <CardContent>
          <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input className="text-white" id="name" placeholder="enter your name" onChange={handleChange} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input className="text-white" id="email" placeholder="enter your email" onChange={handleChange} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input className="text-white" id="password" placeholder="create password" onChange={handleChange}/>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="re_password">Re-enter Password</Label>
              <Input className="text-white" id="re_password" placeholder="reenter password" onChange={handleChange}/>
            </div>
          </div>
      </CardContent>
      <CardFooter className="flex justify-around">
        <Button type="submit">Sign-up</Button>
      </CardFooter>
        </form>
        <a className="text-cyan-800 px-2 py-1" href="/login">Already have an account?</a>
    </Card>
    </div>
  );
};

export default Register;
