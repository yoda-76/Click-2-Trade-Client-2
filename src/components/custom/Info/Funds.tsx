import { useEffect, useState } from "react";
import axios from "axios";

const fundsConfig : any = {
  DHAN: {
    display: (funds: any) => <div>{JSON.stringify(funds)}</div>,
  },
  UPSTOCKS: {
    display: (funds: any) => (
      <div className="grid grid-cols-2 mt-2">
        <div className="bg-gray-600 p-5 m-2 rounded-sm">
          <h1 className="text-2xl font-semibold">Commodity</h1>
          <div className="grid grid-cols-2">
            <div>
              <div>Total Balance: </div>
              <div>Used Margin: </div>
              <div>Available: </div>
            </div>
            <div>
              <div>
                {funds &&
                  (funds.commodity.available_margin +
                    funds.commodity.payin_amount +
                    funds.commodity.adhoc_margin +
                    funds.commodity.notional_cash)}
              </div>
              <div>{funds && funds.commodity.used_margin}</div>
              <div>{funds && funds.commodity.available_margin}</div>
            </div>
          </div>
        </div>
        <div className="bg-gray-600 p-5 m-2 rounded-sm">
          <h1 className="text-2xl font-semibold">Equity</h1>
          <div className="grid grid-cols-2">
            <div>
              <div>Total Balance: </div>
              <div>Used Margin: </div>
              <div>Available: </div>
            </div>
            <div>
              <div>
                {funds &&
                  (funds.equity.available_margin +
                    funds.equity.payin_amount +
                    funds.equity.adhoc_margin +
                    funds.equity.notional_cash)}
              </div>
              <div>{funds && funds.equity.used_margin}</div>
              <div>{funds && funds.equity.available_margin}</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  ANGEL: {
    display: (funds: any) => (
      <div className="bg-gray-600 p-5 m-2 rounded-sm">
        <h1 className="text-2xl font-semibold">Angel Funds</h1>
        <div className="grid grid-cols-2">
          <div>
            <div>Net: </div>
            <div>Available Cash: </div>
            <div>Collateral: </div>
          </div>
          <div>
            <div>{funds && funds.net}</div>
            <div>{funds && funds.availablecash}</div>
            <div>{funds && funds.collateral}</div>
          </div>
        </div>
      </div>
    ),
  },
};

export default function Funds(props: any) {
  const [funds, setFunds] = useState<any>();

  useEffect(() => {
    (async () => {
      const resp: any = await axios.post(
        `${import.meta.env.VITE_server_url}/api/get-funds`,
        {
          account_id: props.account_id,
        },
        {
          withCredentials: true, // Ensure cookies are sent with the request
        }
      );

      // console.log("funds fetched", resp.data);
      setFunds(resp.data.funds); // Assuming the funds data is in the 'data' property
    })();
  }, [props]);

  const renderFunds = () => {
    const broker = props.broker;
    if (fundsConfig[broker]) {
      return fundsConfig[broker].display(funds);
    }
    return <div>No broker is selected</div>;
  };

  return <>{renderFunds()}</>;
}
