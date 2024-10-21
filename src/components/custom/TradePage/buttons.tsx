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
    } catch (e) {
      console.log(e);
    }
  };
  const placeOrder = async (transaction_type: string, optionType: string) => {
    // console.log(
    //   {
    //     accountId: selected,
    //     baseInstrument: base.symbol,
    //     instrumentType: "OPT",
    //     expiry: expiry,
    //     strike: optionType === "CE" ? callStrike : putStrike,
    //     optionType: optionType,
    //     exchange: "NSE",
    //     qty: quantity,
    //     price:
    //       orderType === "LIMIT"
    //         ? optionType === "CE"
    //           ? callLTP
    //           : putLTP
    //         : 0,
    //     triggerPrice: triggerPrice,
    //     orderType: orderType,
    //     side: transaction_type,
    //     productType: productType,
    //   }
    // );
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_server_url}/api/place-order`,
        {
          accountId: selected,
          baseInstrument: base.symbol,
          instrumentType: "OPT",
          expiry: expiry,
          strike: optionType === "CE" ? callStrike : putStrike,
          optionType: optionType,
          exchange: "NSE",
          qty: quantity,
          price:
            orderType === "LIMIT"
              ? triggerPrice
              : 0,
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
        let ltpToken;
        ltpToken = props.optionsData.NSE[base.symbol][`${expiry} : ${optionType === "CE" ? callStrike : putStrike}.0`][optionType].ltpToken
        if(ltpToken){
          updateSl({key: ltpToken, value: preferedSl})
          updateTarget({key: ltpToken, value: preferedTarget})
        }
        
        updatePositions();
        //toast is not working
        toast.success(
          `Order : Sell ${quantity} ${optionType==="CE"?call.key:put.key} ${productType} ${orderType} `,
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
    // console.log("object");
  };
  // const slToCostHandeler = () => {
  //   let totalBuyPrice = 0;
  //   position.map((p: any) => {
  //     totalBuyPrice += p.buy_price;
  //   });
  //   console.log("totalBuyPrice", totalBuyPrice);
  //   updateMtmSl(totalBuyPrice);
  // };

  return (
    <div className="grid grid-cols-3 m-1">
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
      </div>
      <div className="flex-col flex grid-cols-1 items-center">
        <Button
          className="my-1"
          onClick={() => {
            try {
              axios.post(
                `${import.meta.env.VITE_server_url}/api/square-off-all`,
                {
                  account_id: selected
                },
                {
                  withCredentials: true, // Ensure cookies are sent with the request
                }
              ).then(() => {
                toast.success(
                  `Squared off All`,
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
              })
            } catch (error) {
              toast.error("Error", {
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                position: "top-right",
              });
              console.log(error);
            }
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
      <div className="flex flex-col  items-end">
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
    </div>
  );
}
