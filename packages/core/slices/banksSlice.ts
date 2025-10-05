import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SLICE_KEYS } from "../keys";

export interface IBank {
  /** Unique identifier for the bank (e.g., "CIB", "BANK_ALAHLY") */
  id: string;
  /** User-friendly name displayed in the UI (e.g., "CIB Bank", "Bank AlAhly") */
  displayName: string;
  /** Array of SMS sender addresses/numbers used by this bank (e.g., ["CIB", "19666"]) */
  addresses: string[];
  /** Optional Arabic names/variations for the bank (e.g., ["البنك الأهلي"]) */
  arabicNames?: string[];
  /** Hex color code for UI theming and brand representation (e.g., "#1E40AF") */
  color: string;
  /** Path to bank logo image */
  logo?: string;
}

export interface BanksState {
  selectedBanks: Array<IBank["id"]>;
  availableBanks: IBank[];
}

// Available banks configuration
const AVAILABLE_BANKS: IBank[] = [
  {
    id: "CIB",
    displayName: "CIB Bank",
    addresses: ["CIB", "19666"],
    arabicNames: ["بنك CIB"],
    color: "#1E40AF",
    logo: "@/assets/images/cib.png",
  },
  {
    id: "BANK_ALAHLY",
    displayName: "Bank AlAhly",
    addresses: ["BanK-AlAhly", "AlAhly", "البنك الأهلي"],
    arabicNames: ["البنك الأهلي", "البنك الاهلي"],
    color: "#DC2626",
    logo: "@/assets/images/nbe.png",
  },
  {
    id: "BANQUE_MISR",
    displayName: "Banque Misr",
    addresses: ["Banque", "BanqueMisr", "بنك مصر"],
    arabicNames: ["بنك مصر"],
    color: "#059669",
    logo: "@/assets/images/banuqe-masr.png",
  },
];

const initialState: BanksState = {
  selectedBanks: [], // Start with no banks selected to force user configuration
  availableBanks: AVAILABLE_BANKS,
};

const banksSlice = createSlice({
  name: SLICE_KEYS.BANKS,
  initialState,
  reducers: {
    selectBank: (state, action: PayloadAction<string>) => {
      const bankId = action.payload;
      if (!state.selectedBanks.includes(bankId)) {
        state.selectedBanks.push(bankId);
      }
    },
    deselectBank: (state, action: PayloadAction<string>) => {
      const bankId = action.payload;
      state.selectedBanks = state.selectedBanks.filter((id) => id !== bankId);
    },
    toggleBank: (state, action: PayloadAction<string>) => {
      const bankId = action.payload;
      if (state.selectedBanks.includes(bankId)) {
        state.selectedBanks = state.selectedBanks.filter((id) => id !== bankId);
      } else {
        state.selectedBanks.push(bankId);
      }
    },
    setBanks: (state, action: PayloadAction<string[]>) => {
      state.selectedBanks = action.payload;
    },
    resetBanks: (state) => {
      state.selectedBanks = [];
    },
  },
});

export const { selectBank, deselectBank, toggleBank, setBanks, resetBanks } =
  banksSlice.actions;

export default banksSlice.reducer;
