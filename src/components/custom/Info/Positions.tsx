import { Button } from "@/components/ui/button";
import useAccountStore from "@/store/accountStore";
import usePositionStore from "@/store/positionStore";
import useSlStore from "@/store/slStore";
import axios from "axios";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function Positions() {
  const { position } = usePositionStore((state) => ({ ...state }));
  const {tslBase, updateTslBase,updateSl, updateTarget, increaseSl, decreaseSl, increaseTarget, decreaseTarget }:{tslBase:any, updateTslBase:Function, updateSl:Function, updateTarget:Function, increaseSl:Function, decreaseSl:Function, increaseTarget:Function, decreaseTarget:Function} = useSlStore((state) => ({
    ...state,
  }));
  const { selected}:{master: any, selected:string} = useAccountStore((state) => ({...state}));

  
  const [slValue, setSlValue] = useState<any>();
  const [targetValue, setTargetValue] = useState<any>();
  const slToCostHandeler = (key:string, value:number)=>{
    updateSl({ key ,value });
  }
  return (
    <>
        <ToastContainer />

      <div className="grid grid-cols-12 ">
        <div>Symbol Name</div>
        <div>Qty</div>
        <div>pnl</div>
        <div>ltp</div>
        <div>SL</div>
        <div>set SL</div>
        <div>Target</div>
        <div>set Target</div>
        <div>TSL</div>
        <div>s2c</div>
        <div>buy price</div>
        <div>Action</div>
      </div>
      <div className="bg-white w-[100%] p-[0.5px]"/>
      {position[0] && position.map((v: any) => {
        // console.log(v);
        return (
          <div className="grid grid-cols-12">
            <div className="break-words">
              {v.symbolName ? v.symbolName : "---"}
            </div>
            <div>{v.netQty ? v.netQty : "Qty"}</div>
            <div>{v.pnl}</div>
            <div>{v.ltp ? v.ltp : "LTP"}</div>
            <div className="grid grid-cols-3">
              <div className="hover:cursor-pointer hover:bg-black" onClick={() => decreaseSl({ key: v.ltpToken})}>-</div>
              <div>{v.sl ? v.sl : "--"}</div>
              <div className="hover:cursor-pointer hover:bg-black" onClick={() => increaseSl({ key: v.ltpToken })}>+</div>
            </div>
            <input
              className="text-black m-1 rounded-lg"
              type="number"
              placeholder="set SL"
              value={slValue}
              onChange={(e) => {
                setSlValue(Number(e.target.value));
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateSl({ key: v.ltpToken, value: slValue });
                }
              }}
            />
            <div className="grid grid-cols-3">
              <div className="hover:cursor-pointer hover:bg-black" onClick={() => decreaseTarget({ key: v.ltpToken})}>-</div>
              <div>{v.target ? v.target : "--"}</div>
              <div className="hover:cursor-pointer hover:bg-black" onClick={() => increaseTarget({ key: v.ltpToken })}>+</div>
            </div>
            <input
              className="text-black m-1 rounded-lg"
              type="number"
              placeholder="set Target"
              value={targetValue}
              onChange={(e) => {
                setTargetValue(Number(e.target.value));
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateTarget({ key: v.ltpToken, value: targetValue });
                }
              }}
            />
            <div>{v.netQty!=0?(tslBase[v.ltpToken] ? <Button onClick={()=>{
              updateTslBase({key: v.ltpToken, value: null})
            }}>turn off</Button> : <Button onClick={()=>{
              console.log( v.ltp)
              updateTslBase({key: v.ltpToken, value: v.ltp})
              console.log("tsl set");
            }}>turn on</Button>):"---"}</div>

            <div>{v.netQty!=0?<Button onClick={()=>{
              slToCostHandeler(v.ltpToken,v.buyPrice)
            }}>Sl 2 Cost</Button>:"---"}</div>
            
            <div>{v.buyPrice ? v.buyPrice : "---"}</div>

            {v.netQty!=0?<Button onClick={() => {
              //call square off single api
              axios.post(`${import.meta.env.VITE_server_url}/api/square-off-single`, {
                account_id: selected,
                position: v,
              }, {
                withCredentials: true, // Ensure cookies are sent with the request
              }).then(() => {
                toast.success(
                  `Squared off : ${v.symbolName}`,
                  {
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    position: "top-right",
                  }
                );
              }).catch((err) => {
                toast.error(err.message, {
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  position: "top-right",
                });
              })
            }}>Exit</Button>:<div>--</div>}
          </div>
        );
      })}
    </>
  );
  // console.log(`sell_value: ${p.sell_value}, buy_value: ${p.buy_value}, quantity: ${p.quantity}, ltp: ${ltp}, multiplier: ${p.multiplier}`)
}

// {
//       "exchange": "NSE",
//       "multiplier": 1,
//       "value": 24.11,
//       "pnl": 0.02,
//       "product": "I",
//       "instrument_token": "NSE_EQ|INE528G01035",
//       "average_price": 0,
//       "buy_value": 24.11,
//       "overnight_quantity": 0,
//       "day_buy_value": 24.11,
//       "day_buy_price": 24.11,
//       "overnight_buy_amount": 0,
//       "overnight_buy_quantity": 0,
//       "day_buy_quantity": 1,
//       "day_sell_value": 0,
//       "day_sell_price": 0,
//       "overnight_sell_amount": 0,
//       "overnight_sell_quantity": 0,
//       "day_sell_quantity": 0,
//       "quantity": 1,
//       "last_price": 24.13,
//       "unrealised": 0.02,
//       "realised": 0,
//       "sell_value": 0,
//       "tradingsymbol": "YESBANK",
//       "trading_symbol": "YESBANK",
//       "close_price": 23.99,
//       "buy_price": 24.11,
//       "sell_price": 0
//     }
