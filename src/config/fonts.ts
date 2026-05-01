//src/lib/fonts.ts
import {
  Cairo,
  Tajawal,
  Alexandria,
  Noto_Kufi_Arabic,
  IBM_Plex_Sans_Arabic,
  Inter,
  Geist,
  Poppins,
  Roboto,
  DM_Sans,
} from "next/font/google";

  export const cairoFont= Cairo({ subsets: ["arabic"], weight: ["400", "600", "700"] });
  export const tajawalFont= Tajawal({ subsets: ["arabic"], weight: ["400", "500", "700"] });
  export const alexandriaFont= Alexandria({ subsets: ["arabic"] });
  export const noto_kufiFont= Noto_Kufi_Arabic({ subsets: ["arabic"] });
  export const ibm_plex_arabicFont= IBM_Plex_Sans_Arabic({subsets: ["arabic"], weight: ["400", "500", "700"]});
  
  export const interFont= Inter({ subsets: ["latin"] });
  export const geistFont= Geist({ subsets: ["latin"] });
  export const poppinsFont= Poppins({ subsets: ["latin"], weight: ["400", "600"] });
  export const robotoFont= Roboto({ subsets: ["latin"], weight: ["400", "700"] });
  export const dm_sansFont= DM_Sans({ subsets: ["latin"] });

export const arabicFonts = {
  cairo: cairoFont,
  tajawal: tajawalFont,
  alexandria:alexandriaFont,
  noto_kufi: noto_kufiFont,
  ibm_plex_arabic:ibm_plex_arabicFont
};

export const englishFonts = {
  inter: interFont,
  geist: geistFont,
  poppins:poppinsFont,
  roboto:robotoFont,
  dm_sans:dm_sansFont
};
