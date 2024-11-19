import { Button } from "@/components/ui/button";
import useAccountStore from "@/store/accountStore";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrderBook(props: any) {
  const {selected}:{master: any, selected:string} = useAccountStore((state) => ({...state}));
  const [orders, setOrders] = useState<any>({});
  useEffect(() => {
    (async () => {
      try {
        const resp = await axios.post(`${import.meta.env.VITE_server_url}/api/get-orders`, {
          accountId: selected,
          account_type: props.account_type,
        }, {
          withCredentials: true, // Ensure cookies are sent with the request
        });
        console.log("orders fetched", resp.data);
        const tempOrders = resp.data;
        //reverse orders
        tempOrders.reverse();
        setOrders(tempOrders);
      } catch (e) {
        console.log(e);
        setOrders([]);
      }
    })();
  }, [props]);
  return (
    <>
      {/* {JSON.stringify(orders)} */}
      <div className="grid grid-cols-12 ">
        <div>Symbol Name</div>
        <div>Type</div>
        <div>Side</div>
        <div>Qty</div>
        <div>Order Price</div>
        <div>Avg Price</div>
        <div>Triggered Price</div>
        <div>Status</div>
        <div>Time/Date</div>
        <div>Order Id</div>
        <div>Message</div>
        <div>Action</div>
      </div>
      <div className="bg-white w-[100%] p-[0.5px]"/>
      {Object.keys(orders)[0] && Object.keys(orders).map(i=>{
        const v = orders[i].orderDetails
        console.log(v);
        return (
          <div className="grid grid-cols-12 ">
            <div className="break-words">
              {v.symbolName ? v.symbolName : "---"}
            </div>
            <div className="break-words">
              {v.type ? v.type : "---"}
            </div>
            <div>{v.side ? v.side : "---"}</div>
            <div>{v.qty ? v.qty : "Qty"}</div>
            <div>{v.price ? v.price : "---"}</div>
            <div>{v.average_price ? v.average_price : "---"}</div>
            <div>
              {v.trigger_price ? v.trigger_price : "---"}
            </div>
            <div>{v.status ? v.status : "---"}</div>
            <div className="break-words">
              {v.timeStamp ? v.timeStamp : "---"}
            </div>
            <div className="break-words">
              {v.orderId ? v.orderId : "---"}
            </div>
            <div className="break-words">
              {v.message ? v.message : "---"}
            </div>
            <div>{(v.status==="open"||v.status==="pending" || v.status==="PENDING"||v.status==="after market order req received"|| v.status==="modify after market order req received" || v.status==="TRANSIT")?<div className="flex gap-2"><Button onClick={() => {
              // console.log(v.order_id);
              axios.post(`${import.meta.env.VITE_server_url}/api/cancel-order`, { orderId: v.orderId, accountId: selected}, {
                withCredentials: true, // Ensure cookies are sent with the request
              })
            }}>Cancel</Button> 
            {/* <Button onClick={() => {}}>Modify</Button> */}
            </div>:("---")}</div>
          </div>
          // <div key={i}>
          //   {v.tradingsymbol}
          //   {v.order_type}
          //   {v.transaction_type}
          //   {v.quantity}
          //   {"v.rem_qty"}
          //   {"v.order_price"}
          //   {"v.traded_price"}
          //   {"v.triggered_price"}
          //   {v.status}
          //   {v.order_timestamp}
          //   {v.order_id}
          //   {v.status_message}
          //   {"v.action"}
          // </div>
        );
      })}
    </>
  );
}
