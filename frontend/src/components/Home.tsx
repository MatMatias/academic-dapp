import type { JsonRpcSigner } from "@ethersproject/providers";
import { useState, useEffect } from "react";
import { Roles } from "../enums";
import Admin from "./Admin";
import Professor from "./Professor";
import Student from "./Student";
import getSignerRole from "../services/getSignerRole";
import provider from "../services/provider";

const Home = () => {
  const [signer, setSigner] = useState<JsonRpcSigner | undefined>(undefined);
  const [signerRole, setSignerRole] = useState<Roles | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function connect() {
      await provider.send("eth_requestAccounts", []);
      setSigner(provider.getSigner());
    }

    connect();
  }, []);

  useEffect(() => {
    (async function () {
      await provider.send("eth_requestAccounts", []);
      setSigner(provider.getSigner());
      if (signer) {
        const signerAddress: string | undefined = await signer?.getAddress();
        setSignerRole(await getSignerRole(signerAddress));
        setIsLoading(false);
      }
    })();
  }, [signer]);

  if (isLoading) {
    return <h1>Loading</h1>;
  }

  if (signer) {
    if (signerRole === Roles.Admin) {
      return <Admin signer={signer} />;
    }

    if (signerRole === Roles.Professor) {
      return <Professor />;
    }

    if (signerRole === Roles.Student) {
      return <Student />;
    }
  }

  return <h1>ERROR</h1>;
};

export default Home;
