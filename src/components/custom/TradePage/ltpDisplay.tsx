
import useSymbolStore from "@/store/symbolStore";
import useLtpStore from "@/store/ltpStore";
import useOrderParameterStore from "@/store/orderParameterStore";

export default function LtpDisplay() {
  const {base, call, put} = useSymbolStore((state) => ({base: state.base, call: state.call, put: state.put}));
  const {baseLTP, callLTP, putLTP} = useLtpStore((state) => ({...state}));
  const {instrumentType} = useOrderParameterStore((state) => ({...state}));
  return (
    <div className="flex justify-between m-1 mt-4 text-white">
      {<div className="flex-col flex  items-start">
        <div className=" flex ">
          Symbol : <div>{call.symbol}</div>
          {/* Key: <div>{call.key}</div> */}
        </div>
        <div className=" flex  ">
          LTP : <div>{callLTP}</div>

        </div>
      </div>}
      <div className="flex-col flex grid-cols-1 items-center">
        <div className=" ">{base.symbol}</div> 
        <div className=" flex">
          <div>{baseLTP}</div>
        </div>
      </div>
      {(instrumentType==="IDX-OPT"||instrumentType==="EQ-OPT")&&<div className="flex flex-col  items-end ">
        <div className=" flex ">
          Symbol : <div>{put.symbol}</div>
          {/* Key: <div>{put.key}</div> */}
        </div>
        <div className=" flex">
          LTP : <div>{putLTP}</div>
        </div>
      </div>}
    </div>
  );
}
