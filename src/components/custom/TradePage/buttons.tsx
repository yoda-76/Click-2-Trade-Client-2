import { Button } from "@/components/ui/button";
import axios from "axios";
// import React from 'react'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useOrderParameterStore from "@/store/orderParameterStore";
import useSymbolStore from "@/store/symbolStore";
import useAccountStore from "@/store/accountStore";
import usePositionStore from "@/store/positionStore";
import useSlStore from "@/store/slStore";
import useLtpStore from "@/store/ltpStore";

function extractId(input: string): {
  type: "MASTER" | "CHILD" | null;
  id: string | null;
} {
  console.log("input: ", input);
  if (!input) return { type: null, id: null };
  const masterRegex = /^MASTER:([a-zA-Z0-9]+)$/;
  const childRegex = /^CHILD:([a-zA-Z0-9]+)$/;

  let match = input.match(masterRegex);
  if (match) {
    return { type: "MASTER", id: match[1] };
  }

  match = input.match(childRegex);
  if (match) {
    return { type: "CHILD", id: match[1] };
  }

  return { type: null, id: null };
}

export default function Buttons(props: any) {
  // const { putLTP, callLTP } = useLtpStore((state) => ({ ...state }));
  const { call, put, base } = useSymbolStore((state) => ({ ...state }));
  const {
    quantity,
    orderType,
    productType,
    triggerPrice,
    expiry,
    callStrike,
    putStrike,
    exchange,
    instrumentType
  } = useOrderParameterStore((state) => ({ ...state }));

  const {
    selected,
  }: {
    master: any;
    child: any[];
    selected: string;
    setSelectedAccount: (data: any) => void;
  } = useAccountStore((state) => ({ ...state }));
  const { updatePosition } = usePositionStore((state) => ({ ...state }));
  const {preferedSl, preferedTarget, updateSl, updateTarget}:{sl:any, target:any, mtmSl:any, mtmTarget:any, preferedSl:number|null, preferedTarget:number|null, updatePreferedSl:Function, updatePreferedTarget:Function, updateSl:Function, updateTarget:Function, updateMtmSl:Function, updateMtmTarget:Function, tslBase:any, updateTslBase:Function, mtmTslBase:any, updateMtmTslBase:Function}  = useSlStore((state) => ({...state}));
  const {callLTP, putLTP, baseLTP} = useLtpStore((state) => ({...state}))

  const updatePositions = async () => {
    const { type} = extractId(selected);

    try {
      const resp = await axios.post(
        `${import.meta.env.VITE_server_url}/api/get-positions`,
        {
          account_id: selected,
          account_type: type,
        },
        {
          withCredentials: true, // Ensure cookies are sent with the request
        }
      );
      console.log("orders fetched", resp.data);
      updatePosition(resp.data);
      return
    } catch (e) {
      console.log(e);
    }
  };
  const placeOrder = async (transaction_type: string, optionType: string) => {
    try {
      let price = 0;
      if(orderType === "LIMIT"){
        price = triggerPrice
      }else if(orderType === "LIMIT AT LTP"){
        if(instrumentType === "IDX-OPT") price = optionType === "CE" ? callLTP : putLTP
        else if(instrumentType === "EQ") price = baseLTP
      }
      const res = await axios.post(
        `${import.meta.env.VITE_server_url}/api/place-order`,
        {
          accountId: selected,
          baseInstrument: base.symbol,
          instrumentType,
          expiry: expiry,
          strike: optionType != "EQ" ?optionType === "CE" ? callStrike : putStrike: 0,
          optionType: optionType,
          exchange,
          qty: quantity,
          price,
          triggerPrice: triggerPrice,
          orderType: orderType,
          side: transaction_type,
          productType: productType,
        },
        {
          withCredentials: true, // Ensure cookies are sent with the request
        }
      );
      if (res.status === 200) {
        console.log("done", res);
        //update sl
        //get ltpToken 
        if(instrumentType === "IDX-OPT"){
          let ltpToken;
          ltpToken = props.optionsData[exchange][base.symbol][`${expiry} : ${optionType === "CE" ? callStrike : putStrike}`][optionType].ltpToken
          if(ltpToken && preferedSl && preferedTarget){
            updateSl({key: ltpToken, value: optionType === "CE" ? callLTP-preferedSl : putLTP-preferedSl})
            updateTarget({key: ltpToken, value: optionType === "CE" ? callLTP+preferedTarget : putLTP+preferedTarget})
          }
          updatePositions();
        }
        else if(instrumentType === "EQ"){
          let ltpToken;
          ltpToken = props.optionsData[exchange].EQUITY[base.symbol].ltpToken
          if(ltpToken && preferedSl && preferedTarget){
            updateSl({key: ltpToken, value: optionType === "CE" ? callLTP-preferedSl : putLTP-preferedSl})
            updateTarget({key: ltpToken, value: optionType === "CE" ? callLTP+preferedTarget : putLTP+preferedTarget})
          }
          updatePositions();
        }

        //toast is not working
        toast.success(
          `Order : ${transaction_type} ${quantity} ${optionType==="CE"?call.key:put.key} ${productType} ${orderType} `,
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
      } else {
        console.log("error toast", res);
        toast.error("res.data.message", {
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          position: "top-right",
        });
      }
    } catch (error: any) {
      console.log("error toast", error);
      toast.error(error.message, {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        position: "top-right",
      });
    }
  };

  const squareOffAll = async () => {
    try {
      const resp = await axios.post(
        `${import.meta.env.VITE_server_url}/api/square-off-all`,
        {
          account_id: selected
        },
        {
          withCredentials: true, // Ensure cookies are sent with the request
        }
      );
      console.log("square off all orders", resp.data);
      updatePositions();
      toast.success(
        `All positions Squared Off`,
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
    } catch (error: any) {
      console.log(error);
      toast.error(error.message, {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        position: "top-right",
      });
    }
  };

  return (
    <div className="grid grid-cols-3 m-1">
      {(instrumentType==="IDX-OPT" || instrumentType==="EQ-OPT")?
      <div className="flex-col flex  items-start">
      <ToastContainer />
      <Button
        onClick={() => {
          placeOrder("SELL", "CE");
        }}
        className="w-1/2 my-1"
      >
        Sell CE
      </Button>
      <Button
        onClick={() => {
          placeOrder("BUY", "CE");
        }}
        className="w-1/2 my-1"
      >
        Buy CE
      </Button>
    </div> :

    //for equity
    <div className="flex-col flex  items-start">
    <ToastContainer />
    <Button
      onClick={() => {
        placeOrder("SELL", "EQ");
      }}
      className="w-1/2 my-1"
    >
      Sell
    </Button>
    <Button
      onClick={() => {
        placeOrder("BUY", "EQ");
      }}
      className="w-1/2 my-1"
    >
      Buy
    </Button>
  </div>}
      <div className="flex-col flex grid-cols-1 items-center">
        <Button
          className="my-1"
          onClick={() => {
            squareOffAll();
            // try {
            //   axios.post(
            //     `${import.meta.env.VITE_server_url}/api/square-off-all`,
            //     {
            //       account_id: selected
            //     },
            //     {
            //       withCredentials: true, // Ensure cookies are sent with the request
            //     }
            //   ).then(() => {
            //     updatePositions();
            //     toast.success(
            //       `Order : Closed all positions`,
            //       {
            //         autoClose: 5000,
            //         hideProgressBar: false,
            //         closeOnClick: true,
            //         pauseOnHover: true,
            //         draggable: true,
            //         progress: undefined,
            //         position: "top-right",
            //       }
            //     );
            //   })
            // } catch (error) {
            //   toast.error("Error", {
            //     autoClose: 5000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     pauseOnHover: true,
            //     draggable: true,
            //     progress: undefined,
            //     position: "top-right",
            //   });
            //   console.log(error);
            // }
          }}
        >
          Close all positions
        </Button>
        <Button
          className="my-1"
          onClick={async () => {
            try {
              axios.post(
                `${import.meta.env.VITE_server_url}/api/cancel-all-order`,
                {
                  accountId: selected,
                },
                {
                  withCredentials: true, // Ensure cookies are sent with the request
                }
              );
            } catch (error) {
              console.log(error);
            }
          }}
        >
          Cancel all orders
        </Button>
        {/* <Button
          className="my-1"
          onClick={() => {
            slToCostHandeler();
          }}
        >
          SL to Cost
        </Button> */}
      </div>
      {(instrumentType==="IDX-OPT" || instrumentType==="EQ-OPT") && <div className="flex flex-col  items-end">
        <Button
          onClick={() => {
            placeOrder("SELL", "PE");
          }}
          className="w-1/2 my-1"
        >
          Sell PE
        </Button>
        <Button
          onClick={() => {
            placeOrder("BUY", "PE");
          }}
          className="w-1/2 my-1"
        >
          Buy PE
        </Button>
      </div>
}
    </div>
  );
}
