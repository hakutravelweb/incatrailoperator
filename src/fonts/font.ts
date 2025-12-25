import localFont from "next/font/local";

export const gtEestiProDisplay = localFont({
  src: [
    {
      path: "./GT-Eesti-Pro-Display-Regular.woff2",
      weight: "400",
    },
    {
      path: "./GT-Eesti-Pro-Display-Medium.woff2",
      weight: "500",
    },
    {
      path: "./GT-Eesti-Pro-Display-Bold.woff2",
      weight: "700",
    },
    {
      path: "./GT-Eesti-Pro-Display-UltraBold.woff2",
      weight: "900",
    },
  ],
  display: "swap",
  style: "normal",
  fallback: ["sans-serif"],
});
