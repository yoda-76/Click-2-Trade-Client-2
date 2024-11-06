
import CoustomSelect from '@/components/custom/CoustomSelect';
import { Button } from '@/components/ui/button';
import { extractExpiryAndStrike } from '@/lib/extractExpiryAndStrike';
import useOptionChainStore from '@/store/optionChainStore';
import useOptionsDataStore from '@/store/optionsDataStore';
import useStaticStore from '@/store/staticStore';
import useUserStore from '@/store/userStore';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

function OptionChain() {
    const navigate = useNavigate();
    const [base, setBase] = useState("");
    const [expiry, setExpiry] = useState("");
    const [accountId, setAccountId] = useState("");
    const [uidList, setUidList] = useState([]);
    const {
        name,
        updateEmail,
        accounts
      }: {
        name: string | null;
        email: string | null;
        accounts: any;
        updateAccounts: any;
        updateEmail: any;
        updateName: any;
        updateVerified: any;
      } = useUserStore((state) => ({ ...state }));
  const {optionsData, setOptionsData}:{optionsData: any, setOptionsData: Function} = useOptionsDataStore((state) => ({...state}));


  const { OptionChain, setOptionChain} = useOptionChainStore((state) => ({ ...state }));
  const {expiries ,updateExpiries} = useStaticStore((state) => ({updateExpiries:state.updateExpiries, expiries:state.expiries, updateStrikes:state.updateStrikes, strikes:state.strikes}));
  

  useEffect(() => {
    console.log(accounts)
    const newUidList:any = []
    if(accounts) accounts.map((account:any) => {
        if(account.broker === "UPSTOCKS"){
             newUidList.push(account.u_id)
  }})
  console.log(newUidList)
    setUidList(newUidList);
    axios
      .post(`${import.meta.env.VITE_server_url}/api/get-instrumentData`, {
        withCredentials: true, // Ensure cookies are sent with the request
      })
      .then((resp) => {
        console.log(resp.data);
        setOptionsData(resp.data);
        
      });
  }, []);
  const getOptionChain = async (expiry: string, base: string, accountId: string) => {
    console.log(expiry, base)
    axios.post(`${import.meta.env.VITE_server_url}/api/get-option-chain`,{
        accountId,base,expiry
      }).then((resp) => {
        setOptionChain(resp.data);
      })
  }

  return (
    <div className="text-white p-4">
        
      <div className="flex flex-col items-start bg-amber-100 p-2 w-[100%]">
        <h1 className=" flex justify-center font-bold text-black ">Welcome: {name}</h1>
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
      <div className="flex justify-start w-[100%] gap-3 py-4">
      <CoustomSelect
          default={base}
          placeholder="Select Index"
          options={["NIFTY", "BANKNIFTY", "FINNIFTY"]}
          label="Base Instrument"
          setChange={(v: any) => {
            var newBase={symbol:"", key:""}
            
            if (v === "NIFTY" || v === "BANKNIFTY" || v === "FINNIFTY") {
              // let newBase;
              
              if (v === "NIFTY") {
                newBase = { symbol: "NIFTY", key: optionsData.NSE.INDEX.NIFTY.ltpToken };
                setBase("NSE_INDEX|Nifty 50")
            } else if (v === "BANKNIFTY") {
                newBase = { symbol: "BANKNIFTY", key: optionsData?.NSE.INDEX.BANKNIFTY.ltpToken };
                setBase("NSE_INDEX|Nifty Bank")
              } else {
                newBase = { symbol: "FINNIFTY", key: optionsData?.NSE.INDEX.FINNIFTY.ltpToken };
                setBase("NSE_INDEX|Nifty Fin Service")
              }
              
            //   // console.log(newBase, "selected");
            //   updateBase(newBase);
            }else{
              newBase={ symbol: v, key: optionsData.NSE.EQUITY[v].instrument_key }
            //   updateBase(newBase);
            } 
            
            let tempExpiryDates: string[] = [];
            // console.log("optionsData",optionsData);
            Object.keys(optionsData.NSE[newBase.symbol]).map((op) => {
            const result = extractExpiryAndStrike(op);
            if (!tempExpiryDates.includes(result.expiryDate))
                tempExpiryDates.push(result.expiryDate);
            });
            tempExpiryDates.sort((date1: string, date2: string) => new Date(date1).getTime() - new Date(date2).getTime());
            updateExpiries(tempExpiryDates);
          }}
        />
        <CoustomSelect
          default={expiry}
          placeholder="Order Type"
          options={[...expiries]}
          label="Expiry"
          setChange={(v: any) => { 
            setExpiry(v)
          }}
        />

        <CoustomSelect
          default={accountId}
          placeholder="select account"
          options={[...uidList]}
          label="Account (upstox)"
          setChange={(v: any) => { 
            setAccountId(v)
          }}
        />

        <Button
          onClick={() => {
            getOptionChain(expiry, base, accountId);

        }}>Fetch</Button>
      </div>
      {/* Table Headers */}
      <div className="flex items-center gap-2 bg-gray-800 p-2 rounded font-bold">
        {/* Put Options Headers */}
        <div className="grid grid-cols-9 text-center gap-2 flex-1">
          <div>Volume</div>
          <div>IV</div>
          <div>Vega</div>
          <div>Gamma</div>
          <div>Theta</div>
          <div>Delta</div>
          <div>OI (chg)</div>
          <div>OI (lakhs)</div>
          <div>LTP</div>
        </div>

        {/* Strike Price Header */}
        <div className="w-24 text-center">STRIKES</div>

        {/* Call Options Headers */}
        <div className="grid grid-cols-9 text-center gap-2 flex-1">
          <div>LTP</div>
          <div>OI (lakhs)</div>
          <div>OI (chg)</div>
          <div>Delta</div>
          <div>Theta</div>
          <div>Gamma</div>
          <div>Vega</div>
          <div>IV</div>
          <div>Volume</div>
        </div>
      </div>

      {/* Data Rows */}
      {OptionChain && OptionChain.map((item: any, index: number) => (
        <div key={index} className="flex items-center gap-2 bg-gray-900 p-2 rounded mb-2">
          {/* Put Options Data */}
          <div className="grid grid-cols-9 text-center gap-2 flex-1">
            <div>{item.put_options.market_data.volume}</div>
            <div>{item.put_options.option_greeks.iv}</div>
            <div>{item.put_options.option_greeks.vega}</div>
            <div>{item.put_options.option_greeks.gamma}</div>
            <div>{item.put_options.option_greeks.theta}</div>
            <div>{item.put_options.option_greeks.delta}</div>
            <div>{item.put_options.market_data.oi - item.put_options.market_data.prev_oi}</div> {/* OI change */}
            <div>{(item.put_options.market_data.oi / 100000).toFixed(2)}</div> {/* OI in lakhs */}
            <div>{item.put_options.market_data.ltp}</div>
          </div>

          {/* Strike Price */}
          <div className="w-24 text-center font-bold">{item.strike_price}</div>

          {/* Call Options Data */}
          <div className="grid grid-cols-9 text-center gap-2 flex-1">
            <div>{item.call_options.market_data.ltp}</div>
            <div>{(item.call_options.market_data.oi / 100000).toFixed(2)}</div> {/* OI in lakhs */}
            <div>{item.call_options.market_data.oi - item.call_options.market_data.prev_oi}</div> {/* OI change */}
            <div>{item.call_options.option_greeks.delta}</div>
            <div>{item.call_options.option_greeks.theta}</div>
            <div>{item.call_options.option_greeks.gamma}</div>
            <div>{item.call_options.option_greeks.vega}</div>
            <div>{item.call_options.option_greeks.iv}</div>
            <div>{item.call_options.market_data.volume}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default OptionChain;
