import usePositionStore from "@/store/positionStore";
import axios from "axios";

export const updatePositions = async (accountID: string) => {
  const {updatePosition}:{position:any[], updatePosition:Function} = usePositionStore((state) => ({...state}));

    const resp = await axios.post(`${import.meta.env.VITE_server_url}/api/get-positions`, {
        account_id: accountID
      }, {
        withCredentials: true, // Ensure cookies are sent with the request
      });
      console.log("positions fetched", resp);
      updatePosition(resp.data);
}