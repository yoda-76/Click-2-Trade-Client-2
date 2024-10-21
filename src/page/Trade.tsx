import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import Buttons from "../components/custom/TradePage/buttons";
import Inputs from "../components/custom/TradePage/inputs";
import LtpDisplay from "../components/custom/TradePage/ltpDisplay";
import Info from "../components/custom/TradePage/info";
import useAccountStore  from "../store/accountStore";
import useOptionStore from "../store/optionsDataStore";
import useLtpStore from "@/store/ltpStore";
import useSymbolStore from "@/store/symbolStore";
import usePositionStore from "@/store/positionStore";
import useMtmStore from "@/store/mtmStore";
import useSlStore from "@/store/slStore";
import useUserStore from "@/store/userStore";
import { useNavigate } from "react-router-dom";

// const SOCKET_SERVER_URL = "http://localhost:3000";
const socket = io(import.meta.env.VITE_server_url);
const subsribeToken = (token: string)=>{
  socket.emit('subscribe', token);
}  

function extractId(input: string): {
  type: "MASTER" | "CHILD" | null;
  id: string | null;
} {
  if(!input) return {type: null, id: null}
  const masterRegex = /^MASTER:([a-zA-Z0-9]+)$/;
  const childRegex = /^CHILD:([a-zA-Z0-9]+)$/;

  let match = input.match(masterRegex);
  if (match) {
    return { type: "MASTER", id: match[1]  };
  }

  match = input.match(childRegex);
  if (match) {
    return { type: "CHILD", id: match[1] };
  }

  return { type: null, id: null };
}

export default function Trade() {
  const {email} = useUserStore((state)=>({...state}))
  const navigate = useNavigate()

  const {updateMaster, updateChild, selected, setSelectedAccount, updateSelectedBroker}:{master: any,  selected:string , setSelectedAccount: Function, updateMaster: Function, updateChild: Function, updateSelectedBroker: Function} = useAccountStore((state) => ({...state}));
  const {setOptionsData, optionsData} = useOptionStore((state) => ({...state}));
  const {updateBaseLTP, updateCallLTP, updatePutLTP}= useLtpStore((state) => ({...state}));
  const {base, call, put} = useSymbolStore((state) => ({...state}));
  const [accountId, setAccountId] = useState<string | null>(null);
  const [feed, setFeed] = useState<any>({});
  const {position, updatePosition}:{position:any[], updatePosition:Function} = usePositionStore((state) => ({...state}));
  const {updateMtm} = useMtmStore((state) => ({...state}));
  const { updatePreferedSl, updatePreferedTarget, mtmTslBase, updateMtmTslBase, tslBase, updateTslBase, sl, target, mtmSl, mtmTarget, updateSl, updateTarget, updateMtmSl, updateMtmTarget}:{sl:any, target:any, mtmSl:any, mtmTarget:any, preferedSl:number|null, preferedTarget:number|null, updatePreferedSl:Function, updatePreferedTarget:Function, updateSl:Function, updateTarget:Function, updateMtmSl:Function, updateMtmTarget:Function, tslBase:any, updateTslBase:Function, mtmTslBase:any, updateMtmTslBase:Function}  = useSlStore((state) => ({...state}));
  // const {selected}:{master: any, child: any[], selected:string , setSelectedAccount: (data: any) => void} = useAccountStore((state) => ({...state}));
    // const {updatePosition}= usePositionStore((state) => ({...state}));
    const updatePositions=async () => {
    const {type, id} = extractId(selected)

      try {
        const resp = await axios.post(`${import.meta.env.VITE_server_url}/api/get-positions`, {
          account_id: `MASTER:${id}`,
          account_type: type,
        }, {
          withCredentials: true, // Ensure cookies are sent with the request
        });
        console.log("positions fetched", resp);
        updatePosition(resp.data);
        //subscribe to the positions
        resp.data.map((p: any) => {
          subsribeToken(p.ltpToken)
          console.log("subscribing to token", p.ltpToken);
        })
      } catch (e) {
        console.log(e);
      }
    }
  useEffect(() => {
    const fetchData = async () => {
      const queryParameters = new URLSearchParams(location.search);
      const id = queryParameters.get("id");
      setAccountId(id);
      //get all child account id
      //get-child-account-details
      setSelectedAccount(`MASTER:${id}`)

      axios
        .post(`${import.meta.env.VITE_server_url}/api/get-child-account-details`, {
          master_u_id: id,
        }, {
          withCredentials: true, // Ensure cookies are sent with the request
        })
        .then((resp) => {
          // console.log("child;",resp.data);
          updateChild(resp.data);
        });

      axios
        .post(`${import.meta.env.VITE_server_url}/api/get-account-details`, {
         master_u_id:id,
        }, {
          withCredentials: true, // Ensure cookies are sent with the request
        })
        .then((resp) => {
          updateMaster(resp.data.accounts);
          resp.data.accounts.map((account: any) => {
            if (account.u_id === id) {
              console.log(account);
              updateSelectedBroker(account.broker);
            }
          })
        });
        
        axios.post(`${import.meta.env.VITE_server_url}/api/get-prefrences`, { account_id: id },{withCredentials: true,}).then((resp) => {
          console.log("prefrences: ",resp.data);
          updatePreferedSl(resp.data.data.stoploss)
          updatePreferedTarget(resp.data.data.target)
        })
        
        axios.post(`${import.meta.env.VITE_server_url}/api/get-orders`, {
          account_id: `MASTER:${id}`,
          // account_type: type,
        }, {
          withCredentials: true, // Ensure cookies are sent with the request
        }).then(res=>{
          console.log(res);
        })

      // some await functions
      if (id) {
        // For example, fetch some data with the accountId
        // const data = await fetchDataWithAccountId(id);
      }
    };

    fetchData();
    updatePositions()
  }, [location.search]);

  useEffect(() => {
    if(!email && !localStorage.getItem("email")){
      navigate("/login")
    }
    axios
      .post(`${import.meta.env.VITE_server_url}/api/get-instrumentData`, {
        withCredentials: true, // Ensure cookies are sent with the request
      })
      .then((resp) => {
        // console.log(resp.data);
        setOptionsData(resp.data);
        
      });

        
      

    // socket.emit("new-user", { test: 123 });

    // Listen for the "market-data" event
    socket.on('marketData', (data) => {
      // Assuming data is received as an array of ticks
      // console.log(data);
      setFeed((prev:any)=>{
        return {...prev, [data.instrument_token]: data}
      })
      
    });

    return () => {
      socket.off('marketData'); // Cleanup listener on unmount
    };
  }, []);

  useEffect(() => {
    // console.log(feed[base?.key]);
    var newBaseLTP = feed[base?.key]?.last_price;
    // console.log(newBaseLTP, "0");
    // if(!newBaseLTP){
    //   console.log("no base ltp", base?.symbol, feed[base?.key]);
    // }
   
    newBaseLTP && updateBaseLTP(newBaseLTP);
    if(feed[call.key]){
      updateCallLTP(feed[call.key]?.last_price);
        }
    if(feed[put.key]){
      updatePutLTP(feed[put.key]?.last_price);
        }
    //maintaning pnl
    var mtm = 0
    const updatedPosition = position.map(p=>{
      var ltp = 0
      try {
        ltp = feed[p.ltpToken]?.last_price;
        // console.log(ltp);
      } catch (error) {
        ltp = feed[p.ltpToken]?.ltpc.ltp;
      };
      if(typeof ltp === "number"){
        // if(!sl[p.ltpToken] && preferedSl){
        //   updateSl({key: p.ltpToken, value: ltp-preferedSl})
        // }
        // if(!target[p.ltpToken] && preferedTarget){
        //   updateTarget({key: p.ltpToken, value: ltp+preferedTarget})
        // }
        const pnl = Math.trunc(((p.sellPrice - p.buyPrice) + (p.netQty * ltp )) * 100) / 100;

        if(tslBase[p.ltpToken] && ltp>tslBase[p.ltpToken]){
          updateSl({key: p.ltpToken, value:sl[p.ltpToken]+(ltp-tslBase[p.ltpToken])})
          updateTslBase({key: p.ltpToken, value:ltp})
        }



        if(sl[p.ltpToken] >=ltp && sl[p.ltpToken] !==null){
          console.log("squared of, sl hit");
          axios.post(`${import.meta.env.VITE_server_url}/api/square-off-single`, {
            account_id: selected,
            position: p,
          }, {
            withCredentials: true, // Ensure cookies are sent with the request
          }).then(()=>{
            updatePositions()
          })
          updateSl({key: p.ltpToken, value: null})
        }
        
        if(target[p.ltpToken] <=ltp && target[p.ltpToken] !==null){
          console.log("squared of, target hit");
          axios.post(`${import.meta.env.VITE_server_url}/api/square-off-single`, {
            account_id: selected,
            position: p,
          }, {
            withCredentials: true, // Ensure cookies are sent with the request
          }).then(()=>{
            updatePositions()
          })
          updateTarget({key: p.ltpToken, value: null})
        }
        mtm+=pnl
        return {...p, ltp, pnl, sl:sl[p.ltpToken], target:target[p.ltpToken]}
      }
      else{
        mtm+=p.pnl
        return p
      }
    })

    updateMtm(mtm)

    if(mtmTslBase && mtm>mtmTslBase){
      updateMtmSl(mtmSl+(mtm-mtmTslBase))
      updateMtmTslBase(mtm)
    }

    //mtm tsl
    //check mtm sl and target
    if(mtmSl !== null && mtmSl >= mtm){
      console.log("MTM SL HIT");
      axios.post(`${import.meta.env.VITE_server_url}/api/square-off-all`,  {
        account_id: selected
      }, {
        withCredentials: true, // Ensure cookies are sent with the request
      }).then(()=>{
        updatePositions()
      })
      updateMtmSl(null)
    }
    if(mtmTarget !== null && mtmTarget <= mtm){
      console.log("MTM TARGET HIT");
      axios.post(`${import.meta.env.VITE_server_url}/api/square-off-all`,  {
        account_id: selected
      }, {
        withCredentials: true, // Ensure cookies are sent with the request
      }).then(()=>{
        // updateMtmSl(0)
        updatePositions()
        
      })
      updateMtmTarget(null)
    }
    updatePosition(updatedPosition);
  }, [feed]);

  return (
    <div className="">
      <Inputs socket={socket}/>
      <LtpDisplay/>
      <Buttons
        optionsData={optionsData}
        account_id={accountId}
      />
      <Info/>
    </div>
  );
}


