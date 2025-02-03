"use client";

import { AuthUser } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "../supabase/client";
import { getUserSubscrptionStatus } from "../supabase/queries";
import { useToast } from "@/hooks/use-toast";
import { Subscription } from "../supabase/supabase.types";

type SupabaseUserContextType = {
  user: AuthUser | null;
  subscription: Subscription | null;
};

const SupabaseUserContext = createContext<SupabaseUserContextType>({
  user: null,
  subscription: null,
});

export const useSupabaseUser = () => {
  return useContext(SupabaseUserContext);
};

interface SupabaseUserProviderProps {
  children: React.ReactNode;
}

// user, subscription 데이터 얻기 Provider
export const SupabaseUserProvider: React.FC<SupabaseUserProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const { toast } = useToast();
  const supabase = createClient();
  // Fetch the user details
  // subscrption
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        console.log(user);
        setUser(user);
        const { data, error } = await getUserSubscrptionStatus(user.id);
        if (data) {
          setSubscription(data);
        }
        if (error) {
          toast({
            title: "Unexpected Error",
            description: "Oppse! An unexpected error happend. Try again later.",
          });
        }
      }
    };
    getUser();
  }, [supabase, toast]);
  return (
    <SupabaseUserContext.Provider value={{ user, subscription }}>
      {children}
    </SupabaseUserContext.Provider>
  );
};
