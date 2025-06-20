import { create } from "zustand";

import { CreateChamaSchema } from "./schema";

type CreateState = Partial<CreateChamaSchema> & {
  setData: (data: Partial<CreateChamaSchema>) => void;
};

const useCreateStore = create<CreateState>((set) => ({
  setData: (data) => set(data),
}));

export default useCreateStore;
