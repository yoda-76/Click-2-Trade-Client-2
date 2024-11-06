
// import CoustomSelect from '@/components/custom/CoustomSelect';
// import { Button } from '@/components/ui/button';
// import useOptionChainDashboardStore from '@/store/optionChainDashboardStore';
// import useUserStore from '@/store/userStore';
// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import { useNavigate } from "react-router-dom";

// function OptionChainDashboard() {
//     const navigate = useNavigate();
//     // const [expiry, setExpiry] = useState("");
//     const [mainData, setMainData] = useState<any>({});
//     const {
//         name,
//         updateEmail,
//       }: {
//         name: string | null;
//         email: string | null;
//         accounts: any;
//         updateAccounts: any;
//         updateEmail: any;
//         updateName: any;
//         updateVerified: any;
//       } = useUserStore((state) => ({ ...state }));
//   const {OptionChainDashboard, setOptionChainDashboard}:{OptionChainDashboard: any, setOptionChainDashboard: Function} = useOptionChainDashboardStore((state) => ({...state}));


//   useEffect(() => {
    
//     axios
//       .post(`${import.meta.env.VITE_server_url}/api/get-option-chain-dashboard`, {
//         withCredentials: true, // Ensure cookies are sent with the request
//       })
//       .then((resp) => {
//         console.log(resp.data);
//         setOptionChainDashboard(resp.data);
        
//       });
//   }, []);
  

//   return (
//     <div className="text-white p-4">
        
//       <div className="flex flex-col items-start bg-amber-100 p-2 w-[100%]">
//         <h1 className=" flex justify-center font-bold text-black ">Welcome: {name}</h1>
//         <div className="w-[100%] flex justify-between">
//           <Button
//             onClick={() => {
//               navigate("/dashboard");
//             }}
//           >
//             Home
//           </Button>
//           <Button
//             onClick={async () => {
//               axios.post(
//                 `${import.meta.env.VITE_server_url}/api/logout`,
//                 {},
//                 {
//                   withCredentials: true, // Ensure cookies are sent with the request
//                 }
//               );

//               localStorage.clear();
//               updateEmail(null);
//               navigate("/login");
//             }}
//           >
//             logout
//           </Button>
//         </div>
//       </div>
//       <div className="flex justify-start w-[100%] gap-3 py-4">
//       <CoustomSelect
//           default={Object.keys(OptionChainDashboard)[0]}
//           placeholder="Select Index"
//           options={Object.keys(OptionChainDashboard)}
//           label="Base Instrument"
//           setChange={(v: any) => {
//             setMainData(OptionChainDashboard[v][Object.keys(OptionChainDashboard[v])[0]]);
//           }}
//         />
        
//       </div>
//       {/* Table Headers */}
//       <div className="flex items-center gap-2 bg-gray-800 p-2 rounded font-bold">
//         {/* Put Options Headers */}
//         <div className="grid grid-cols-3 text-center gap-2 flex-1">
//           <div>Time</div>
//           <div>CE</div>
//           <div>PE</div>
//         </div>

//       </div>

//       {/* Data Rows */}
//       {mainData && Object.keys(mainData).map((item: any, index: number) => (
//         <div key={index} className="flex items-center gap-2 bg-gray-900 p-2 rounded mb-2">
//           {/* Put Options Data */}
//           <div className="grid grid-cols-3 text-center gap-2 flex-1">
//             <div>{item}</div>
//             <div>{mainData[item].changeInPutVega}</div>
//             <div>{mainData[item].changeInCallVega}</div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default OptionChainDashboard;
