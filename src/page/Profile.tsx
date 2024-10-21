import axios from "axios";
import { Button } from "@/components/ui/button";
import useUserStore from "@/store/userStore";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const {
    name,
    email,
    verified,
    updateEmail,
  }: {
    name: string | null;
    email: string | null;
    accounts: any;
    verified: boolean | null;
    updateAccounts: any;
    updateEmail: any;
    updateName: any;
    updateVerified: any;
  } = useUserStore((state) => ({ ...state }));
  const navigate = useNavigate();




  return (
    <div>
      <div className="flex flex-col items-start bg-amber-100 p-2 w-[100%]">
        <h1 className=" flex justify-center font-bold ">Welcome: {name}</h1>
        <div className="w-[100%] flex justify-between">
          <Button
            onClick={() => {
              navigate("/dashboard");
            }}
          >
            Home
          </Button>
          <Button
            onClick={async () => {
              axios.post(
                `${import.meta.env.VITE_server_url}/api/logout`,
                {},
                {
                  withCredentials: true, // Ensure cookies are sent with the request
                }
              );

              localStorage.clear();
              updateEmail(null);
              navigate("/login");
            }}
          >
            logout
          </Button>
        </div>
      </div>
      <div className="text-white">Name: {name}</div>
      <div className="text-white">Email: {email}</div>
      <div className="text-white">Verified: {verified?verified:"null"}</div>
    </div>
  );
}
// it also needs to handel password change
