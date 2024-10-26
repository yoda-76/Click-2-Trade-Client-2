import useOptionChainStore from "@/store/optionChainStore";
import axios from "axios";

export const fetchOptionChain = async (expiry: string, base: string) => {
  const {setOptionChain} = useOptionChainStore((state) => ({ ...state }));

    axios.post("http://localhost:3000/api/get-option-chain",{
        "access_token":"eyJ0eXAiOiJKV1QiLCJrZXlfaWQiOiJza192MS4wIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiJLTDI3NzAiLCJqdGkiOiI2NzFjYTNmY2U4YWFmNDBmYzg1ODAxZDEiLCJpc011bHRpQ2xpZW50IjpmYWxzZSwiaWF0IjoxNzI5OTMwMjM2LCJpc3MiOiJ1ZGFwaS1nYXRld2F5LXNlcnZpY2UiLCJleHAiOjE3Mjk5ODAwMDB9.5Xr03ZGV9Fh3bC-I6NrXDYGlMENZ11KzYszb05TRpok",
        "expiry":expiry,
        "base":base
      }).then((resp) => {
        console.log(resp.data);
        setOptionChain(resp.data);
      })
}